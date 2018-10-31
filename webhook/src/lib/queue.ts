import Queue from "bull";
import { config, QueueNames } from '../config/queue';

interface InvalidCommand {
    user: string;
}

const invalidCommandQueue = new Queue(QueueNames.invalidCommands, config.redis.url);

export async function queueInvalidCommand(data: InvalidCommand) {

    try {
        const job = await invalidCommandQueue.add({
            user: data.user
        });
        console.log(`Successfully sent invalid command message to user ${data.user}.`);
    } catch (error) {
        console.log('Error occurred while adding job to queue', error);
    }
}