const { Message, Producer } = require('redis-smq');
import * as config from '../config/queue';

interface InvalidCommand {
    user: string;
}

const invalidCommandProducer = new Producer('invalid-commands', config);

export function queueInvalidCommand(data: InvalidCommand) {
    const message = new Message();
    message.setBody(data);
    invalidCommandProducer.produceMessage(message, (err: any) => {
        if (err) console.log(err);
        else console.log(`Successfully sent invalid command message to user ${data.user}.`);
    });
    invalidCommandProducer.shutdown();
}