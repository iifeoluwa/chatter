import { parse } from "url";

const {hostname, auth, port} = parse(process.env.REDISCLOUD_URL);

export const config =  {
    namespace: 'chatter',
    redis: {
        host: hostname,
        port: port,
        url: process.env.REDISCLOUD_URL,
        password: auth.split(':')[1],
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
    online: process.env.ONLINE_USERS_QUEUE_NAME || 'users_online'
}