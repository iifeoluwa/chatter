import Redis from "ioredis";
import { config } from '../config/queue';

const redis = new Redis(config.redis.url);

/**
 * Checks if a user is online by verifying that the userId has been cached.
 * @param userId 
 */
export function isOnline(userId: string) {
    return redis.get(userId).then(user => {
        return true;
    })
    .catch(error => {
        throw error;
    })
}
