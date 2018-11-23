import Redis from "ioredis";
import { Messages } from "../config/messages";
import { RedisConfig, Keys } from "../config/index";
import { buildMessageBody, sendMessage } from "../util/twitter";
import { transformKeyToID, transformToKey, generateMoniker } from "../util/redis";

const redis = new Redis(RedisConfig.redis.url);

export interface Users {
    id: string;
    data: {
        user: string
    }
    progress ?: Function;
}

export default async function(job: Users) {
    let moniker: string = generateMoniker();

    return cacheMoniker(job.data.user, moniker)
        .then(() => redis.scard(Keys.waitlist))
        .then((waitlistLength: Number) => {
            if(waitlistLength === 0) {
                return addUserToWaitlist(job.data.user);
            } else {
                return putUserOnline(job.data.user, moniker);
            }
        })
        .then(() => {
            return Promise.resolve();
        })
        .catch((error: any) => {
            console.log(error)
            return Promise.reject(error)
        });
}

function addUserToWaitlist(user: string) {
    return redis.sadd(Keys.waitlist, transformToKey(user))
        .then(() => {
            const messageEvent = buildMessageBody(Messages.ADDED_TO_WAITLIST, user);
            return sendMessage(messageEvent)
        })
        .then(() => {
            console.log(`Successfully waitlisted user-${user}`);
            return Promise.resolve();
        })
        .catch((error: any) => {
            console.log(error)
            return Promise.reject(error)
        })
}

function putUserOnline(newUser: string, newUserMoniker: string) {
    // Fetch random user from waitlist.
    // Add two entries to online users hash.
    const userToPutOnline = transformToKey(newUser);
    let waitlistedUser: string, waitlistedUserMoniker: string;

    return redis.spop(Keys.waitlist)
        .then((randomWaitlistedUser: string) => {
            // Fetch waitlisted user moniker
            waitlistedUser = randomWaitlistedUser;
            return redis.hget(Keys.moniker, randomWaitlistedUser);
        })
        .then((waitlistedUserNick) => {
            waitlistedUserMoniker = waitlistedUserNick;
            const matchedUsersMap: any = {};

            matchedUsersMap[`${userToPutOnline}`] = waitlistedUser;
            matchedUsersMap[`${waitlistedUser}`] = userToPutOnline;

            return redis.hmset(Keys.online, matchedUsersMap);
        })
        .then(() => {
            // Send message to both users that they've been connected.
            const newUserMessage = Messages.CONNECTED.replace('${username}', waitlistedUserMoniker);
            const waitlistedUserMessage = Messages.CONNECTED.replace('${username}', newUserMoniker);

            const messageToSendWaitlistedUser = buildMessageBody(waitlistedUserMessage, transformKeyToID(waitlistedUser));
            const messageToSendNewUser = buildMessageBody(newUserMessage, newUser);

            const sendConnectionNotificationToWaitlistedUser = sendMessage(messageToSendWaitlistedUser);
            const sendConnectionNotificationToNewUser = sendMessage(messageToSendNewUser);

            return Promise.all([sendConnectionNotificationToNewUser, sendConnectionNotificationToWaitlistedUser]);
        })
        .then(() => console.log(`Successfully connnected ${userToPutOnline} and ${waitlistedUser}`))
        .catch((error: any) => {
            console.log(error);
            Promise.reject(error)
        })

}

/**
 * Cache a user's moniker.
 * N.B: This should ideally be in the redis util but,
 * since we're trying to create as little connections as posible, we can't create a new Redis instance in utils/redis
 * @param user 
 * @param moniker 
 */
function cacheMoniker(user: string, moniker: string) {
    return redis.hset(Keys.moniker, transformToKey(user), moniker);
}