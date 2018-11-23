import Queue from "bull";
import Redis from "ioredis";
import { config, QueueNames } from '../config/queue';

const invalidCommandQueue = createQueue(QueueNames.invalidCommands);
const onlineUsersQueue = createQueue(QueueNames.online);
const commsQueue = createQueue(QueueNames.messaging);
const offlineUsersQueue = createQueue(QueueNames.offline);


/**
 * Adds a new invalid command message to be sent to user to queue.
 * @param data 
 */
export async function queueInvalidCommand(sender: string) {

    try {
        const job = await invalidCommandQueue.add({
            user: sender
        });
        console.log(`Successfully sent invalid command message to user ${sender}.`);
    } catch (error) {
        console.log('Error occurred while adding job to invalid commands queue', error);
    }
}

export function putUserOnline(user: string) {
    onlineUsersQueue.add({user: user})
        .then(result =>  console.log(`Successfully scheduled user ${user} to be put online.`))
        .catch(error => console.log('Error occurred while adding job to online users queue', error.message));
}

export function sendMessageToRecipient(message: string, sender: string) {
    commsQueue.add({sender: sender, message: message})
        .then(result =>  console.log(`Delivering user ${sender}'s message.`))
        .catch(error => console.log('Error occurred while adding job to messaging queue', error.message));
}

export function takeUserOffline(user: string) {
    offlineUsersQueue.add({user: user})
        .then(result =>  console.log(`Successfully scheduled user ${user} to be put offline.`))
        .catch(error => console.log('Error occurred while adding job to online users queue', error.message));
}

/**
 * Create a new queue with `name`.
 *
 * @param {String} name
 * @return {Queue}
 */
function createQueue(name: string) {
    const client = new Redis(config.redis.url);
    const subscriber = new Redis(config.redis.url);

    const opts: Queue.QueueOptions = {
        createClient: function(type) {
            switch(type){
            case 'client':
                return client;
            case 'subscriber':
                return subscriber;
            default:
                return new Redis(config.redis.url);
            }
        }
    };

    return new Queue(name, opts);

}