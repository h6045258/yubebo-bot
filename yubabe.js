const { Client, REST, Routes, Partials, Collection, Options, Sweepers, EmbedBuilder } = require("discord.js");
const { ClusterClient, getInfo } = require("discord-hybrid-sharding");
const Queue = require("./src/resources/Queue");
const ShoukakuClient = require("./src/resources/Shoukaku");
const logger = require("./src/resources/Logger");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

module.exports = class YubabeProMax extends Client {
    constructor() {
        super({
            shards: getInfo().SHARD_LIST,
            shardCount: getInfo().TOTAL_SHARDS,
            failIfNotExists: true,
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: true
            },
            intents: 3276799,
            makeCache: Options.cacheWithLimits({
                ...Options.defaultMakeCacheSettings,
                MessageManager: {
                    sweepInterval: 300,
                    sweepFilter: Sweepers.filterByLifetime({
                        lifetime: 1800,
                        getComparisonTimestamp: (e) =>
                            e.editedTimestamp || e.createdTimestamp
                    }),
                    maxSize: 5
                }
            }),
            partials: [
                Partials.Message,
                Partials.Reaction,
                Partials.User,
                Partials.Channel,
                Partials.GuildMember,
                Partials.ThreadMember,
                Partials.GuildScheduledEvent
            ],
            restTimeOffset: 0,
        });

        this.commands = new Collection();
        this.slashCommands = new Collection();
        this.allCommands = [];
        this.aliases = new Collection();
        this.premium = new Collection();
        this.cooldowns = new Collection();
        this.snipes = new Collection();
        this.categories = fs.readdirSync("./src/commands/");
        this.cluster = new ClusterClient(this);
        this.logger = logger;

        this.usedSuccess = new Collection();

        this.config = require("./src/configs/configs");
        this.color = this.config.color;
        this.e = require("./src/configs/emojis.json");
        this.queue = new Queue(this);
        this.shoukaku = new ShoukakuClient(this);
        this.language = {};

        this.loadDatabase();
        this.loadLanguages();
        this.loadSlashCommands();
        this.loadCommands();
        this.loadEvents();
        this.loadFunctions();
        this.loadHandlers();
    }

    loadDatabase() {
        try {
            mongoose.set("strictQuery", false);
            mongoose.connect(process.env.MONGO_URL);
            this.logger.info("💖 Đã kết nối với MongoDB.");
        } catch (error) {
            this.logger.error(error);
        }
    }

    loadLanguages() {
        const languagesDir = "./src/languages";
        const languages = fs.readdirSync(languagesDir);

        for (const lang of languages) {
            const langDir = `${languagesDir}/${lang}`;
            if (fs.statSync(langDir).isDirectory()) {
                this.language[lang] = {};
                const jsonFiles = fs
                    .readdirSync(langDir)
                    .filter((file) => file.endsWith(".json"));

                for (const jsonFile of jsonFiles) {
                    const filePath = `${langDir}/${jsonFile}`;
                    const content = this.reloadFile(filePath);
                    const key = jsonFile.split(".json")[0];
                    this.language[lang][key] = content;
                }
            }
        }
    }

    loadEvents() {
        this.events = new Map();
        const allevents = [];
        const load_dir = (dir) => {
            const event_files = fs.readdirSync(`./src/events/${dir}`).filter((file) => file.endsWith('.js'));
            for (const file of event_files) {
                try {
                    const eventModule = require(`./src/events/${dir}/${file}`);
                    const eventName = eventModule.event || file.split('.')[0];
                    allevents.push(eventName);
                    this.events.set(eventName, eventModule);
                    if (dir === 'player') {
                        this.shoukaku.on(eventName, eventModule.run.bind(null, this));
                    } else {
                        this.on(eventName, eventModule.run.bind(null, this));
                    }
                } catch (e) {
                    this.logger.error(`Có lỗi xảy ra khi load: ${file} trong thư mục ${dir}\n${String(e.stack)}`);
                }
            }
        };
        ['client', 'guild', 'shard', 'player'].forEach(e => load_dir(e));
        this.logger.info(`💖 Đã load ${allevents.length} events thành công.`);
    }

    async loadSlashCommands() {
        this.once("ready", async () => {
            try {
                require("./src/handlers/SlashCommands.js")(this);
                const applicationCommands = this.config.production
                    ? Routes.applicationCommands(this.user.id ?? "")
                    : Routes.applicationGuildCommands(this.user.id ?? "", this.config.guildId ?? "");
                const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

                await rest.put(applicationCommands, { body: this.allCommands });

                this.logger.info("(/) Đã load thành công tất cả slash command!");
            } catch (error) {
                this.logger.error("Lỗi khi deploy slash comamnd", console.error(error));
            }
        });
    }

    loadCommands() {
        try {
            fs.readdirSync("./src/commands/").forEach((dir) => {
                const commands = fs
                    .readdirSync(`./src/commands/${dir}/`)
                    .filter((file) => file.endsWith(".js"));
                for (const file of commands) {
                    try {
                        const pull = require(`./src/commands/${dir}/${file}`);
                        if (pull.name && pull.category) {
                            this.commands.set(pull.name, pull);
                        } else {
                            this.logger.warn(
                                `Lệnh ${file} trong file ${dir} bị thiếu name: hoặc thiếu category: (* Không thể reload)`,
                            );
                            continue;
                        }
                        if (pull.aliases && Array.isArray(pull.aliases)) {
                            pull.aliases.forEach((alias) =>
                                this.aliases.set(alias, pull.name),
                            );
                        }
                    } catch (e) {
                        this.logger.error(
                            `Có lỗi xảy ra khi load command: ${file} trong thư mục ${dir}\n${e.stack}`,
                        );
                    }
                }
            });
            this.logger.info(
                `💖 Đã load ${this.commands.size} commands thành công.`,
            );
        } catch (e) {
            this.logger.error(`Có lỗi xảy ra khi load commands\n${e.stack}`);
        }
    }

    loadHandlers() {
        const handlersDir = "./src/handlers";
        const skipFiles = {
            handlers: [
                "SlashCommands.js",
                "Fishings.js",
                //"Autoresponder.js",
                "Huntings.js",
                // "Level.js",
                "BacklistGiveaways.js"
            ]
        };
        const handlerFiles = fs
            .readdirSync(handlersDir)
            .filter(
                (file) =>
                    file.endsWith(".js") && !skipFiles.handlers.includes(file),
            );

        handlerFiles.forEach((file) => {
            try {
                const handler = require(`${handlersDir}/${file}`);
                if (typeof handler === "function") {
                    handler(this);
                } else {
                    this.logger.error(
                        `Handler tại file ${file} không thuộc dạng Function`,
                    );
                }
            } catch (e) {
                this.logger.error(
                    `Load handler thất bại: ${file}\n${e.stack ? e.stack : e}`,
                );
            }
        });
        this.logger.info(
            `💖 Đã load ${handlerFiles.length} handlers thành công.`,
        );
    }

    loadFunctions() {
        const functionsDir = "./src/functions";
        const skipFiles = {
            handlers: [
                "Blackjack.js",
            ],
        };
        const functionFiles = fs
            .readdirSync(functionsDir)
            .filter((file) => file.endsWith(".js") && !skipFiles.handlers.includes(file),);

        functionFiles.forEach((file) => {
            try {
                const func = require(`${functionsDir}/${file}`);
                if (typeof func === "function") {
                    func(this);
                } else {
                    this.logger.error(
                        `Function tại file ${file} không thuộc dạng Function`,
                    );
                }
            } catch (e) {
                this.logger.error(
                    `Load function thất bại: ${file}\n${e.stack ? e.stack : e}`,
                );
            }
        });
        this.logger.info(
            `💖 Đã load ${functionFiles.length} functions thành công,`,
        );
    }

    shardMessage(channelId, message, isEmbed) {
        const channel = this.channels.cache.get(channelId);
        if (channel) {
            if (!isEmbed) {
                channel.send(message);
            } else {
                channel.send({ embeds: [message] });
            }
        }
    }

    embed() {
        return new EmbedBuilder();
    }

    reloadCommand(commandName) {
        const command = this.commands.get(commandName);
        if (!command) {
            this.logger.warn(`Không tìm thấy lệnh: ${commandName}`);
            return false;
        }
        const filePath = `${process.cwd()}/src/commands/${command.category}/${command.name.charAt(0).toUpperCase() + command.name.slice(1)}.js`;
        delete require.cache[require.resolve(filePath)];
        try {
            const newCommand = require(filePath);
            this.commands.set(newCommand.name, newCommand);
            this.logger.info(`Đã reload lệnh: ${newCommand.name}`);
            return true;
        } catch (error) {
            this.logger.error(`Lỗi khi reload lệnh ${commandName}: ${error.message}`);
            return false;
        }
    }

    reloadEvent(eventName) {
        const capitalizedEventName = eventName.charAt(0).toUpperCase() + eventName.slice(1);
        let filePath;
        let eventType;
        for (const dir of ['client', 'guild', 'shard', 'player']) {
            const testPath = `${process.cwd()}/src/events/${dir}/${capitalizedEventName}.js`;
            if (fs.existsSync(testPath)) {
                filePath = testPath;
                eventType = dir;
                break;
            }
        }
        if (!filePath) {
            this.logger.warn(`Không tìm thấy event: ${eventName}`);
            return false;
        }
        delete require.cache[require.resolve(filePath)];
        try {
            const newEvent = require(filePath);
            this.removeAllListeners(eventName);
            if (eventType === 'player') {
                this.shoukaku.on(eventName, newEvent.run.bind(null, this));
            } else {
                this.on(eventName, newEvent.run.bind(null, this));
            }
            this.logger.info(`Đã reload event: ${eventName}`);
            return true;
        } catch (error) {
            this.logger.error(`Lỗi khi reload event ${eventName}: ${error.message}`);
            return false;
        }
    }

    /* reloadFile(filePath) {
         if (!fs.existsSync(filePath)) {
             this.logger.warn(`Không tìm thấy file: ${filePath}`);
             return false;
         }
         delete require.cache[require.resolve(filePath)];
         try {
             require(filePath);
             // this.logger.info(`Đã reload file: ${filePath}`);
             return true;
         } catch (error) {
             this.logger.error(`Lỗi khi reload file ${filePath}: ${error.message}`);
             return false;
         }
     }*/

    reloadFile(fileToReload) {
        try {
            const resolvedPath = require.resolve(fileToReload);
            if (require.cache[resolvedPath]) {
                delete require.cache[resolvedPath];
            }
            const reloadedFile = require(fileToReload);
            return reloadedFile;
        } catch (err) {
            this.logger.error(
                `Lỗi khi reload lại file: ${fileToReload}\n${err}`,
            );
            return null;
        }
    }

    reloadAll() {

        this.commands.forEach((command) => {
            this.reloadCommand(command.name);
        });

        // this.events.forEach((event, eventName) => {
        //     this.reloadEvent(eventName);
        // });

        // const handlersDir = "./src/handlers";
        // fs.readdirSync(handlersDir)
        //     .filter(file => file.endsWith('.js'))
        //     .forEach(file => {
        //         this.reloadHandler(file.slice(0, -3));
        //     });

        this.logger.info('Đã reload tất cả lệnh');
        return true;
    }

    async login(token) {
        await super.login(token);
    }
};
