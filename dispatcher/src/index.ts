import { RedisConfig } from "./config";
const InvalidCommandsConsumer = require("./consumers/invalid_comands");

const invalidCommandsConsumer = new InvalidCommandsConsumer(RedisConfig)

invalidCommandsConsumer.run();