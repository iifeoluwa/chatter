import Redis from "ioredis";
import { transformKeyToID, transformToKey } from "../util/redis";
import { RedisConfig, Keys } from "../config/index";
import { buildMessageBody, sendMessage } from "../util/twitter"

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
    redis.hget(Keys.online, transformToKey(job.data.sender))
        .then(chatMateId => {
            if (chatMateId) {
                const messageToSend = buildMessageBody(job.data.message, transformKeyToID(chatMateId));
                return sendMessage(messageToSend);
            }
        })
        .then(() => {})
        .catch(error => Promise.reject(error));
}