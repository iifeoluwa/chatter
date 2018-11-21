import Redis from "ioredis";
import { User, IUser } from "../models/user";
import { Messages } from "../config/messages";
import { RedisConfig, Keys } from "../config/index";
import { buildMessageBody, sendMessage } from "../util/twitter"
import { transformKeyToID, transformToKey, generateMoniker } from "../util/redis"

const redis = new Redis(RedisConfig.redis.url);

export interface Users {
    id: string;
    data: {
        user: string
    }
    progress ?: Function;
}

export default function(job: Users) {
    let moniker: string;

    User.fetchUser(job.data.user)
        .then((user: IUser): Promise<any> => {
            if (user === null) {
                // User is not registered. Create a moniker, cache the moniker and put them online.
                moniker = generateMoniker();
                const addNewUser = User.create({userId: job.data.user, moniker: moniker});

                return Promise.all([addNewUser, cacheMoniker(job.data.user, moniker)]);
            }

            // User is registered. Cache the moniker and put them online
            moniker = user.get('moniker');
            return cacheMoniker(job.data.user, moniker)
        })
        .then(() => redis.scard(Keys.waitlist))
        .then((waitlistLength: Number) => {
            if(waitlistLength === 0) {
                return addUserToWaitlist(job.data.user);
            } else {
                return putUserOnline(job.data.user);
            }
        })
        .then(() => {
            return Promise.resolve();
        })
        .catch((error: any) => {
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
            return Promise.reject(error)
        })
}

function putUserOnline(user: string) {
    // Fetch random user from waitlist.
    // Add two entries to online users hash.
    const userToPutOnline = transformToKey(user);
    let waitlistedUser: string;

    return redis.spop(Keys.waitlist)
        .then((randomWaitlistedUser: string) => {
            const matchedUsersMap: any = {};

            matchedUsersMap[`${userToPutOnline}`] = randomWaitlistedUser;
            matchedUsersMap[`${randomWaitlistedUser}`] = userToPutOnline;

            waitlistedUser = randomWaitlistedUser;
            return redis.hmset(Keys.online, matchedUsersMap);
        })
        .then(() => {
            // Send message to both users that they've been connected.
            const newUserMessage = Messages.CONNECTED.replace('${username}', waitlistedUser);
            const waitlistedUserMessage = Messages.CONNECTED.replace('${username}', userToPutOnline);

            const messageToSendWaitlistedUser = buildMessageBody(waitlistedUserMessage, transformKeyToID(waitlistedUser));
            const messageToSendNewUser = buildMessageBody(newUserMessage, user);

            const sendConnectionNotificationToWaitlistedUser = sendMessage(messageToSendWaitlistedUser);
            const sendConnectionNotificationToNewUser = sendMessage(messageToSendNewUser);

            return Promise.all([sendConnectionNotificationToNewUser, sendConnectionNotificationToWaitlistedUser]);
        })
        .then(() => console.log(`Successfully connnected ${userToPutOnline} and ${waitlistedUser}`))
        .catch((error: any) => Promise.reject(error))

}

/**
 * Cache a user's moniker.
 * N.B: This should ideally be in the redis util but,
 * since we're trying to create as little connections as posible, we can't create a new Redis instance in utils/redis
 * @param user 
 * @param moniker 
 */
function cacheMoniker(user: string, moniker: string|null) {
    if (moniker === null) {
        moniker = generateMoniker();
    }

    return redis.hset(Keys.moniker, transformToKey(user), moniker);
}