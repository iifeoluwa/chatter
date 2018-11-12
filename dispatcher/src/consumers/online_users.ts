import Redis from "ioredis";
import { Messages } from "../config/messages";
import { RedisConfig, Keys } from "../config/index";
import { buildMessageBody, sendMessage } from "../lib/twitter"
import { transformKeyToID, transformToKey } from "../util/redis"

const redis = new Redis(RedisConfig.redis.url);

interface Users {
    id: string;
    data: {
        user: string
    }
    progress ?: Function;
}

export default function(job: Users): Promise<any> {
    return redis.scard(Keys.waitlist)
        .then((waitlistLength) => {
            if(waitlistLength === 0) {
                return addUserToWaitlist(job.data.user);
            } else {
                return putUserOnline(job.data.user);
            }
        })
        .then(() => {})
        .catch(error => Promise.reject(error));
}

function addUserToWaitlist(user: string) {
    return redis.sadd(Keys.waitlist, transformToKey(user))
        .then(() => {
            const messageEvent = buildMessageBody(Messages.ADDED_TO_WAITLIST, user);
            return sendMessage(messageEvent)
        })
        .then(() => console.log(`Successfully waitlisted user-${user}`))
        .catch((error: any) => Promise.reject(error))
}

function putUserOnline(user: string) {
    // Fetch random user from waitlist.
    // Add two entries to online users hash.
    const userToPutOnline = transformToKey(user);
    let waitlistedUser: string;

    return redis.spop(Keys.waitlist)
        .then((randomWaitlistedUser: string) => {
            const matchedUsersMap = {
                userToPutOnline: randomWaitlistedUser,
                randomWaitlistedUser: userToPutOnline
            };

            waitlistedUser = randomWaitlistedUser;
            return redis.hmset(Keys.online, matchedUsersMap);
        })
        .then(() => {
            // Send message to both users that they've been connected.
            const newUserMessage = Messages.CONNECTED.replace('${user}', waitlistedUser);
            const waitlistedUserMessage = Messages.CONNECTED.replace('${user}', userToPutOnline);

            const messageToSendWaitlistedUser = buildMessageBody(waitlistedUserMessage, transformKeyToID(waitlistedUser));
            const messageToSendNewUser = buildMessageBody(waitlistedUserMessage, user);

            const sendConnectionNotificationToWaitlistedUser = sendMessage(messageToSendWaitlistedUser);
            const sendConnectionNotificationToNewUser = sendMessage(messageToSendNewUser);

            return Promise.all([sendConnectionNotificationToNewUser, sendConnectionNotificationToWaitlistedUser]);
        })
        .then(() => console.log(`Successfully connnected ${userToPutOnline} and ${waitlistedUser}`))
        .catch((error: any) => Promise.reject(error))

}