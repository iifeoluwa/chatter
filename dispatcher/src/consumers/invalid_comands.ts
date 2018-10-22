const { Consumer } = require('redis-smq');
import { RedisConfig, QueueNames } from "../config"

interface InvalidCommandMessage {
    user: string;
}

class InvalidCommandsConsumer extends Consumer {
    /**
     *
     * @param message
     * @param cb
     */
    consume(message: InvalidCommandMessage, callback: any) {
        // sendInvalidCommandMessageToUser()
        callback();
    }
}

InvalidCommandsConsumer.queueName = QueueNames.invalidCommands;

export default InvalidCommandsConsumer;