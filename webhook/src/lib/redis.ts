import Redis from "ioredis";
import { config } from '../config/queue';
import { Keys } from '../config/queue'

const redis = new Redis(config.redis.url);

/**
 * Checks if a user is online by verifying that the userId has been cached.
 * @param userId 
 */
export function isOnline(userId: string) {
    return redis.hexists(Keys.online, transformToKey(userId))
        .then(keyExists => {
            if(keyExists) {
                return true;
            }

            throw new Error('User not online.');
        })
        .catch(error => {
            throw error;
        })
}

function transformToKey(user: string) {
    return `user-${user}`;
}