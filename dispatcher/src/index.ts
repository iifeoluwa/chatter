import Queue from "bull";
import Redis from "ioredis"
import { RedisConfig, QueueNames } from "./config";
const INVALID_COMMANDS_PROCESSOR = `${__dirname}/consumers/invalid_comands.js`;

/**
 * Create a new queue with `name`.
 *
 * @param {String} name
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
                return new Redis();
            }
        }
    };

    return new Queue(name, opts);

}

const invalidCommandsConsumer = createQueue(QueueNames.invalidCommands);

console.log('Starting Consumers');
invalidCommandsConsumer.process(INVALID_COMMANDS_PROCESSOR);
console.log('Consumers started.')