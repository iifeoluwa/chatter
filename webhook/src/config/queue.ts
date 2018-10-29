import { parse } from "url";

const {hostname, auth, port} = parse(process.env.REDISCLOUD_URL);

const config =  {
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

export default config;