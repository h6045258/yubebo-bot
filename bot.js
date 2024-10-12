const { ClusterManager, ReClusterManager, HeartbeatManager } = require('discord-hybrid-sharding');
const express = require('express');
const app = express();
const logger = require('./src/resources/Logger');
const figlet = require('figlet');
const path = require('path');
require('dotenv').config();

console.log(figlet.textSync('Yubabe Pro Max'));
const manager = new ClusterManager('./manager.js', {
    totalClusters: 'auto',
    totalShards: 'auto',
    shardsPerClusters: 2,
    mode: 'process',
    token: process.env.TOKEN,
    /*restarts: {
        max: 5,
        interval: 60000 * 60
    },*/
    queue: {
        auto: true
    }
});

const ClusterSharding = require('./src/events/cluster/ClusterSharding');
ClusterSharding(manager, logger);

manager.on('debug', (message) => {
    if (message.includes('Queue')) {
        logger.info(`${message}`);
    } else {
        logger.info(`${message}`);
    }
});

manager.spawn({ timeout: -1 }).catch(err => {
    console.error('Đã xảy ra lỗi khi spawn cluster:', err)
});

manager.extend(new ReClusterManager());

manager.extend(
    new HeartbeatManager({
        interval: 2000,
        maxMissedHeartbeats: 5,
    })
);

/* process.on('SIGINT', async () => {
    logger.info('Đã nhận SIGINT. Bắt đầu khởi động an toàn...');
    try {
        await manager.recluster.start({ restartMode: 'gracefulSwitch' });
        logger.info('Khởi động lại thành công');
        process.exit(0);
    } catch (error) {
        logger.error('Lỗi trong quá trình khởi động an toàn:', error);
        process.exit(1);
    }
}); */

const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'managers', 'Shard.html'));
});

app.get('/api/status', (req, res) => {
    const status = {
        totalClusters: manager.totalClusters,
        totalShards: manager.totalShards,
        clusters: Array.from(manager.clusters.values()).map(cluster => ({
            id: cluster.id,
            status: cluster.ready ? 'sẵn sàng' : 'chưa sẵn sàng',
            shards: cluster.shardList,
            uptime: process.uptime()
        }))
    };
    res.json(status);
});

app.post('/api/restart', (req, res) => {
    const { clusterId } = req.body;
    const cluster = manager.clusters.get(parseInt(clusterId));
    if (cluster) {
        cluster.respawn()
            .then(() => res.json({ message: `Cluster ${clusterId} đã được khởi động lại thành công` }))
            .catch(error => res.status(500).json({ error: `Không thể khởi động lại Cluster ${clusterId}`, details: error.message }));
    } else {
        res.status(404).json({ error: `Không tìm thấy Cluster ${clusterId}` });
    }
});

app.post('/api/kill', (req, res) => {
    const { clusterId } = req.body;
    const cluster = manager.clusters.get(parseInt(clusterId));
    if (cluster) {
        try {
            cluster.kill();
            res.json({ message: `Cluster ${clusterId} đã được tắt thành công` });
        } catch (error) {
            res.status(500).json({ error: `Không thể tắt Cluster ${clusterId}`, details: error.message });
        }
    } else {
        res.status(404).json({ error: `Không tìm thấy Cluster ${clusterId}` });
    }
});

app.listen(PORT, () => {
    logger.info(`Server đang chạy tại http://localhost:${PORT}`);
});