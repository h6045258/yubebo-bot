const moment = require('moment-timezone');
const axios = require('axios');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, printf } = format;

class Logger {
    constructor() {
        this.webhookUrl = process.env.WEBHOOK_URL;

        const logFormat = printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`;
        });

        const dailyRotateFileTransport = new transports.DailyRotateFile({
            filename: 'logs/out/out-%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '100m',
            maxFiles: '14d',
        });

        const errorRotateFileTransport = new transports.DailyRotateFile({
            filename: 'logs/err/err-%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '100m',
            maxFiles: '14d',
            level: 'error',
        });

        this.logger = createLogger({
            format: combine(
                timestamp({ format: () => this.getTimeStamp() }),
                logFormat
            ),
            transports: [
                dailyRotateFileTransport,
                errorRotateFileTransport,
                new transports.Console({ level: 'debug' })
            ],
            exceptionHandlers: [
                new transports.DailyRotateFile({
                    filename: 'logs/exceptions-%DATE%.log',
                    datePattern: 'DD-MM-YYYY',
                    zippedArchive: true,
                    maxSize: '100m',
                    maxFiles: '14d',
                }),
                new transports.Console()
            ]
        });
    }

    getTimeStamp() {
        return moment().tz("Asia/Ho_Chi_Minh").format('DD-MM-YYYY HH:mm:ss');
    }

    async sendToWebhook(message) {
        if (this.webhookUrl) {
            try {
                await axios.post(this.webhookUrl, {
                    content: message
                });
            } catch (error) {
                console.error(`[ERROR] Không thể gửi log tới webhook: ${error.message}`);
            }
        }
    }

    async sendEmbedToWebhook(embed) {
        if (this.webhookUrl) {
            try {
                await axios.post(this.webhookUrl, {
                    embeds: [embed]
                });
            } catch (error) {
                console.error(`[ERROR] Không thể gửi log embed tới webhook: ${error.message}`);
            }
        }
    }

    async shardWarn(message) {
        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setDescription(`[${this.getTimeStamp()}] ${message}`);

        this.logger.warn(message);
        await this.sendEmbedToWebhook(embed);
    }

    async shardError(message) {
        const embed = new EmbedBuilder()
            .setColor('#FF0000') 
            .setDescription(`[${this.getTimeStamp()}] ${message}`);

        this.logger.error(message);
        await this.sendEmbedToWebhook(embed);
    }

    async shardReady(message) {
        const embed = new EmbedBuilder()
            .setColor('#28A745')
            .setDescription(`[${this.getTimeStamp()}] ${message}`);

        this.logger.info(message);
        await this.sendEmbedToWebhook(embed);
    }

    async shardWait(message) {
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setDescription(`[${this.getTimeStamp()}] ${message}`);

        this.logger.info(message);
        await this.sendEmbedToWebhook(embed);
    }

    login(message) {
        this.logger.info(message);
    }

    log(...args) {
        const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
        ).join(' ');
        this.logger.info(message);
    }

    error(...args) {
        const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
        ).join(' ');
        this.logger.error(message);
    }

    warn(...args) {
        const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
        ).join(' ');
        this.logger.warn(message);
    }

    info(...args) {
        const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
        ).join(' ');
        this.logger.info(message);
    }
}

module.exports = new Logger();