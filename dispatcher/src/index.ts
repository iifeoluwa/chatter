import Queue from "bull";
import { RedisConfig, QueueNames } from "./config";
const INVALID_COMMANDS_PROCESSOR = `${__dirname}/consumers/invalid_comands.js`;

const invalidCommandsConsumer = new Queue(QueueNames.invalidCommands, RedisConfig.redis.url);

console.log('Starting Consumers');
invalidCommandsConsumer.process(INVALID_COMMANDS_PROCESSOR);
console.log('Consumers started.')