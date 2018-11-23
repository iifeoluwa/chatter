import Redis from "ioredis";
import { Users } from "./online_users";
import { Messages } from "../config/messages";
import { transformToKey, transformKeyToID } from "../util/redis";
import { RedisConfig, Keys } from "../config/index";
import { buildMessageBody, sendMessage} from "../util/twitter";

const redis = new Redis(RedisConfig.redis.url);

export default function(job: Users) {
    const user: string = transformToKey(job.data.user);
    let userMoniker: string;

    return redis.hget(Keys.moniker, user)
        .then((moniker: string) => {
            userMoniker = moniker;
            return redis.hget(Keys.online, user)
        })
        .then(async (chatMate: string) => {
            if (chatMate !== null) {
                const takeUsersOffline = redis.hdel(Keys.online, user, chatMate);
                const addChatMateToWaitlist = redis.sadd(Keys.waitlist, chatMate);

                // Inform chatmate user has gone offline and they're being reconnected
                const chatMateID = transformKeyToID(chatMate);
                const messageToSendChatmate = Messages.CHATMATE_OFFLINE.replace('${username}', userMoniker);
                const sendMessageToChatmate = sendMessage(buildMessageBody(messageToSendChatmate, chatMateID));

                const sendMessageToUser = sendMessage(buildMessageBody(Messages.OFFLINE, job.data.user));

                return Promise.all([takeUsersOffline, addChatMateToWaitlist, sendMessageToChatmate, sendMessageToUser]);
            } else {
                try {
                    let message: any;
                    const removeUserFromWaitlist = await redis.srem(Keys.waitlist, user);

                    if(removeUserFromWaitlist) {
                        message = buildMessageBody(Messages.REMOVED_FROM_WAITLIST, job.data.user);
                    } else {
                        // User is not connected to a user and not on waitlist.
                        message = buildMessageBody(Messages.NOT_ONLINE, job.data.user);
                    }

                    return sendMessage(message);
                } catch(error) {
                    throw error;
                }
            }
        })
        .then(() => {
            return Promise.resolve({})
        })
        .catch(err => {
            console.log(err)
            return Promise.reject(err)
        })
}