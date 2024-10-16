module.exports = (originShard, message, manager, logger) => {
    if (!originShard || !message) return;

    switch (message.type) {
        case 'shutdown':
            switch (message.shard) {
                case 'all':
                    logger.warn('Tắt tất cả các shard');
                    for (const shard of manager.clusters.values()) {
                        shard.kill();
                        process.exit();
                    }
                    break;
                default:
                    logger.warn(`Tắt shard ${message.shard}`);
                    const shard = manager.clusters.get(message.shard);
                    if (shard) shard.kill();
                    break;
            }
            break;
        case 'reboot':
            switch (message.shard) {
                case 'all':
                    logger.warn('Khởi động lại tất cả các shard');
                    for (const shard of manager.clusters.values()) {
                        shard.respawn();
                    }
                    break;
                default:
                    logger.warn(`Khởi động lại shard ${message.shard}`);
                    const shard = manager.clusters.get(message.shard);
                    if (shard) shard.respawn();
                    break;
            }
            break;
    }
};
