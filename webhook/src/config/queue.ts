'use strict';

export default {
    namespace: 'chatter',
    redis: {
        url: process.env.REDISCLOUD_URL,
        connect_timeout: 3600000,
    },
    log: {
        enabled: 0,
        options: {
            level: 'trace',
            /*
            streams: [
                {
                    path: path.normalize(`${__dirname}/../logs/redis-smq.log`)
                },
            ],
            */
        },
    }
}