'use strict';

import * as twit from 'twit';
import { createHmac } from "crypto";
import config from '../config/twitter';

const TWIT = new twit({
    consumer_key:         config.consumer_key,
    consumer_secret:      config.consumer_secret,
    access_token:         config.access_token,
    access_token_secret:  config.access_token_secret,
});

export function addWebhook(url: string): Promise<Object> {
    const path = `account_activity/all/${config.env_name}/webhooks`;
    return TWIT.post(path, {url: url})
        .then((result: twit.PromiseResponse) => {
            return result.data;
        })
        .catch((error: twit.Twitter.Errors)=> {
            throw error;
        });
}

export function fetchWebhooks(): Promise<Object> {
    return TWIT.get('account_activity/all/webhooks')
        .then((result: twit.PromiseResponse) => {
            return result.data;
        })
        .catch((error: twit.Twitter.Errors)=> {
            throw error;
        });
}

export function createHash(data: string): string {
    const hash = createHmac('sha256', config.consumer_secret)
        .update(data)
        .digest('base64');
    return hash;
}

export function addSubscription(){
    return TWIT.post(`account_activity/all/${config.env_name}/subscriptions`)
    .then((result: twit.PromiseResponse) => {
        return result.data;
    })
    .catch((error: twit.Twitter.Errors)=> {
        throw error;
    });
}

export default TWIT;