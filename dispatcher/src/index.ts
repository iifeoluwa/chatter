import Queue from "bull";
import bluebird from "bluebird";
import mongoose from "mongoose";
import { RedisConfig, QueueNames, Mongo } from "./config";

const Redis = require('ioredis');

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
    Redis.Promise = bluebird;

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

/**
 * Initiate connection to database
 */
mongoose.Promise = Mongo.options.promiseLibrary;
mongoose.connect(Mongo.uri, Mongo.options);

const db = mongoose.connection

db.on('error', (err: any) => {
    if (err.message.code === 'ETIMEDOUT' || err.name === 'MongoNetworkError') {
        console.log('A network error occurred while connecting to db. Retrying...')
        mongoose.connect(Mongo.uri, Mongo.options)
    }

    console.log(err)
})

db.once('open', () => {

    /**
     * Start consumers
     */
    invalidCommandsConsumer.process(INVALID_COMMANDS_PROCESSOR);
    onlineUsersConsumer.process(ONLINE_USERS_PROCESSOR);
    messagesConsumer.process(MESSAGES_PROCESSOR);
    offlineConsumer.process(OFFLINE_USERS_PROCESSOR);
    console.log('Consumers started.');

});

console.log('Starting Consumers');