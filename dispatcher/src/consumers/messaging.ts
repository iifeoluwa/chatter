import Redis from "ioredis";
import { transformKeyToID } from "../util/redis";
import { RedisConfig, Keys } from "../config/index";
import { buildMessageBody, sendMessage } from "../lib/twitter"

const redis = new Redis(RedisConfig.redis.url);

interface Messaging {
    id: string;
    data: {
        message: string;
        sender: string
    }
    progress ?: Function;
}

export default function(job: Messaging) {
    // Fetch user that sender is connected to
    redis.hget(Keys.online, job.data.sender)
        .then(chatMateId => {
            const messageToSend = buildMessageBody(job.data.message, transformKeyToID(chatMateId));

            return sendMessage(messageToSend);
        })
        .then(() => {})
        .catch(error => Promise.reject(error));
}