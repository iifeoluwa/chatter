'use strict';

export default {
    namespace: 'chatter',
    redis: {
        url: process.env.REDISCLOUD_URL,
        connect_timeout: 3600000,
    },
    log: {
        enabled: 1,
        options: {
            level: 'trace',
        },
    }
}