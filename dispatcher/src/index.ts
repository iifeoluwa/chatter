import Queue from "bull";
import Redis from "ioredis";
import { RedisConfig, QueueNames } from "./config";

const INVALID_COMMANDS_PROCESSOR = `${__dirname}/consumers/invalid_comands.js`;
const OFFLINE_USERS_PROCESSOR = `${__dirname}/consumers/offline_users.js`;
const ONLINE_USERS_PROCESSOR = `${__dirname}/consumers/online_users.js`;
const MESSAGES_PROCESSOR = `${__dirname}/consumers/messaging.js`;

/**
 * Create a new queue with `name`.
 *
 * @param {String} namex
 * @return {Queue}
 */
function createQueue(name: string) {
    const client = new Redis(RedisConfig.redis.url);
    const subscriber = new Redis(RedisConfig.redis.url);

    const opts: Queue.QueueOptions = {
        createClient: function(type) {
            switch(type){
            case 'client':
                return client;
            case 'subscriber':
                return subscriber;
            default:
                return new Redis(RedisConfig.redis.url);
            }
        }
    };

    return new Queue(name, opts);

}

const invalidCommandsConsumer = createQueue(QueueNames.invalidCommands);
const onlineUsersConsumer = createQueue(QueueNames.online);
const messagesConsumer = createQueue(QueueNames.messaging);
const offlineConsumer = createQueue(QueueNames.offline);

console.log('Starting Consumers');
invalidCommandsConsumer.process(INVALID_COMMANDS_PROCESSOR);
onlineUsersConsumer.process(ONLINE_USERS_PROCESSOR);
messagesConsumer.process(MESSAGES_PROCESSOR);
offlineConsumer.process(OFFLINE_USERS_PROCESSOR);
console.log('Consumers started.')