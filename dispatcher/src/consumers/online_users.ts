import Redis from "ioredis";
import { Messages } from "../config/twitter";
import { RedisConfig } from "../config/index";
import { buildMessageBody, sendMessage } from "../lib/twitter"

const redis = new Redis(RedisConfig.redis.url);

interface Users {
    id: string;
    data: {
        message: string;
        user: string
    }
    progress ?: Function;
}

export default function(job: Users): Promise<any> {
    const messageEvent = buildMessageBody(job.data.message, job.data.user);

    return redis.llen('waitlist')
        .then((waitlistLength) => {
            if(waitlistLength === 0) {
                return addUserToWaitlist(job.data.user);
            }
        })
        .then(() => {})
        .catch(error => Promise.reject(error));
}

function transformToKey(user: string) {
    return `user-${user}`;
}

function addUserToWaitlist(user: string) {
    return redis.rpush('waitlist', transformToKey(user))
        .then(() => {
            const messageEvent = buildMessageBody(Messages.ADDED_TO_WAITLIST, user);
            return sendMessage(messageEvent)
        })
        .then(() => console.log(`Successfully waitlisted user-${user}`))
        .catch((error: any) => Promise.reject(error))
}