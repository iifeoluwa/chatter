export const RedisConfig =  {
    namespace: 'chatter',
    redis: {
        url: process.env.REDISCLOUD_URL,
        connect_timeout: 3600000,
    },
    log: {
        enabled: 0,
        options: {
            level: 'trace'
        },
    }
};

export const QueueNames = {
    invalidCommands: process.env.INVALID_COMMAND_QUEUE_NAME
}