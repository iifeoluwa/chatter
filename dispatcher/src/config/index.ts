import { parse } from "url";

const {hostname, auth, port} = parse(process.env.REDISCLOUD_URL);

export const RedisConfig =  {
    namespace: 'chatter',
    redis: {
        host: hostname,
        port: port,
        url: process.env.REDISCLOUD_URL,
        password: auth.split(':')[1],
        connect_timeout: 3600000,
    },
    log: {
        enabled: true,
        options: {
            level: 'trace'
        },
    }
};

export const QueueNames = {
    invalidCommands: process.env.INVALID_COMMAND_QUEUE_NAME || 'invalid_commands',
    online: process.env.ONLINE_USERS_QUEUE_NAME || 'users_online',
    messaging: process.env.ACTIVE_USERS_QUEUE_NAME || 'messaging'
}


export const Keys = {
    waitlist: 'waitlist',
    online: 'online_users'
}