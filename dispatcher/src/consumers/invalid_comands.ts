const { Consumer } = require('redis-smq');
import { sendInvalidCommandMessage } from "../lib/twitter"
import { QueueNames } from "../config"

interface InvalidCommandMessage {
    user: string;
}

class InvalidCommandsConsumer extends Consumer {
    /**
     *
     * @param message
     * @param cb
     */
    consume(data: InvalidCommandMessage, callback: any) {
        sendInvalidCommandMessage(data.user)
            .then(() => callback())
            .catch(err => {
                callback(err.message);
            });
    }
}

InvalidCommandsConsumer.queueName = QueueNames.invalidCommands;

export default InvalidCommandsConsumer;