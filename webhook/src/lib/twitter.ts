'use strict';

import { hit, RequestOptions } from './request'
import { Response, GotError } from 'got';
import { createHmac } from "crypto";
import config from '../config/twitter';

interface MessageCreate {
    target: {
        recipient_id: string;
    },
    sender_id: string;
    source_app_id?: string;
    message_data: {
        text: string;
        entities?: {
            hashtags?: [],
            symbols?: [],
            user_mentions?: [],
            urls?: []
        }
    }
};

interface DirectMessageEvent {
    type: string;
    id: string;
    created_timestamp: string;
    message_create: MessageCreate;
};

export function addWebhook(url: string): Promise<Object> {
    const path = `account_activity/all/${config.env_name}/webhooks`;
    const options: RequestOptions = {
        method: 'POST',
        queryParams: {
            url: url
        }
    };

    return hit(path, options)
        .then((result: Response<object>) => {
            return result.body;
        })
        .catch((error: GotError)=> {
            throw error;
        });
}

export function fetchWebhooks(): Promise<Object> {
    return hit('account_activity/all/webhooks', {method: 'GET'})
        .then((result: Response<object>) => {
            return result.body;
        })
        .catch((error: GotError)=> {
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
    return hit(`account_activity/all/${config.env_name}/subscriptions`, {method: 'POST'})
        .then((result: Response<object>) => {
            return result.body;
        })
        .catch((error: GotError)=> {
            throw error;
        });
}

export function triggerCheck(webhookId: string) {
    const path = `account_activity/all/${config.env_name}/webhooks/${webhookId}`
    return hit(path, {method: 'PUT'})
        .then((result: Response<object>) => {
            return result.body;
        })
        .catch((error: GotError)=> {
            console.log({error})
            throw error;
        });
}

export function fetchMessageData(event: ) {

}