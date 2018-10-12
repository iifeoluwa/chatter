'use strict';

import { hit, RequestOptions } from './request'
import { Response, GotError } from 'got';
import { createHmac } from "crypto";
import config from '../config/twitter';


export function addWebhook(url: string): Promise<Object> {
    const path = `account_activity/all/${config.env_name}/webhooks`;
    const options: RequestOptions = {
        method: 'GET',
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
            throw error;
        });
}