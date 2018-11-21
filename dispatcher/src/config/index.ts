export const RedisConfig =  {
    namespace: 'chatter',
    redis: {
        url: process.env.REDIS_URL,
        connect_timeout: 3600000,
    },
    log: {
        enabled: true,
        options: {
            level: 'trace'
        },
    }
};

export const Mongo = {
    uri: process.env.MONGODB_URI || 'mongodb://mongo:27017',
    options: {
        promiseLibrary: Promise,
        autoReconnect: true,
        reconnectTries: 10,
        reconnectInterval: 2000,
        autoIndex: false,
        useNewUrlParser: true,
    }
}
export const QueueNames = {
    invalidCommands: process.env.INVALID_COMMAND_QUEUE_NAME || 'invalid_commands',
    online: process.env.ONLINE_USERS_QUEUE_NAME || 'users_online',
    messaging: process.env.ACTIVE_USERS_QUEUE_NAME || 'messaging',
    offline: process.env.ONLINE_USERS_QUEUE_NAME || 'users_offline',
}

export const Keys = {
    waitlist: 'waitlist',
    online: 'online_users',
    moniker: 'monikers'
}