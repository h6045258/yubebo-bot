const { error } = require('winston');
const ShardMessage = require('./ClusterMessage');

module.exports = (manager, logger) => {
    manager.on('clusterCreate', cluster => {
        logger.info(`Cluster [ ${cluster.id} ] đã được tạo.`);

        cluster.on('message', message => {
            logger.info(`Tiếp nhận thông tin: ${JSON.stringify(message)} từ cluster ${cluster.id}`);
            ShardMessage(cluster, message, manager, logger);
        });

        cluster.on('error', (error) => {
            logger.error(`Cluster ${cluster.id} gặp vấn đề lỗi:`, error.stack);
        });
    });
};