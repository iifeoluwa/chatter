'use strict';

import * as twit from 'twit';
import config from '../config/twitter';

const TWIT = new twit({
    consumer_key:         config.consumer_key,
    consumer_secret:      config.consumer_secret,
    access_token:         config.access_token,
    access_token_secret:  config.access_token_secret,
});

export function addWebhook(url: string): Promise<any> {
    const path = `/account_activity/all/${config.env_name}/webhooks`;
    return TWIT.get(path, {url: url})
        .then((result: any) => {
            return result.data;
        })
        .catch((error: any)=> {
            throw error;
        });
}

export function fetchWebhooks(): Promise<any> {
    return TWIT.get('account_activity/all/webhooks')
        .then((result: any) => {
            return result.data;
        })
        .catch((error: any)=> {
            throw error;
        });
}

export default TWIT;