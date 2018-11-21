import { Int32 } from "bson";

const Moniker = require("moniker");

export function transformKeyToID(user: string): string {
    return user.substring(user.indexOf('-') + 1);
}

export function transformToKey(user: string): string {
    return `user-${user}`;
}

export function generateMoniker(): string {
    const randomName: string = Moniker.choose();
    const names: string[] = randomName.split('-');
    const randomNumber: Number = Math.floor(Math.random() * 99);

    const firstWord = names[0].charAt(0).toUpperCase() + names[0].slice(1);
    const secondWord = names[1].charAt(0).toUpperCase() + names[1].slice(1);

    return `${firstWord}${secondWord}${randomNumber}`;
}