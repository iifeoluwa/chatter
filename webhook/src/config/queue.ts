export const config =  {
    namespace: 'chatter',
    redis: {
        url: process.env.REDIS_URL,
        connect_timeout: 3600000,
    },
    log: {
        enabled: 1,
        options: {
            level: 'trace',
        },
    }
};

export const QueueNames = {
    invalidCommands: process.env.INVALID_COMMAND_QUEUE_NAME || 'invalid_commands',
    online: process.env.ONLINE_USERS_QUEUE_NAME || 'users_online',
    messaging: process.env.ACTIVE_USERS_QUEUE_NAME || 'messaging',
    offline: process.env.OFFLINE_USERS_QUEUE_NAME || 'users_offline',
}

export const Keys = {
    waitlist: 'waitlist',
    online: 'online_users',
}