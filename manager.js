require('events').defaultMaxListeners = 30;
const logger = require('./src/resources/Logger');
const Yubabe = require('./yubabe');
const client = new Yubabe();

process.on('uncaughtException', (error) => {
    client.logger.error('Ngoại lệ không được bắt:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    client.logger.error('Từ chối không được xử lý tại:', promise, 'lý do:', reason);
});

client.login(process.env.TOKEN);
