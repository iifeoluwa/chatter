export function transformKeyToID(user: string) {
    return user.substring(user.indexOf('-') + 1);
}

export function transformToKey(user: string) {
    return `user-${user}`;
}