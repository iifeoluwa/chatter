'use strict';

import { Request, Response, Next } from "restify";
import { addSubscription, addWebhook, fetchWebhooks, triggerCheck } from '../lib/twitter';

export class WebhooksController {

    constructor() {}

    fetchAll(req: Request, res: Response, next: Next) {
        fetchWebhooks().then((data: any)  => {
            res.send(200, {status: 'success', data: data});
            return next();
        })
        .catch((error: any) => {
            res.send(400, {status: 'error', data: {message: error.message, code: error.code}});
            return next();
        })
    }

    add(req: Request, res: Response, next: Next) {
        addWebhook(req.query.url).then((data: any) => {
            res.send(200, {status: 'success', data: data});
            return next();
        })
        .catch((error: any) => {
            res.send(400, {status: 'error', data: {message: error.message, code: error.code}});
            return next();
        })
    }

    subscribe(req: Request, res: Response, next: Next) {
        addSubscription().then((data: any) => {
            res.send(200, {status: 'success', data: data});
            return next();
        })
        .catch((error: any) => {
            res.send(400, {status: 'error', data: {message: error.message, code: error.code}});
            return next();
        })
    }

    check(req: Request, res: Response, next: Next) {
        triggerCheck(req.query.webhookId).then((data: any) => {
            res.send(200, {status: 'success', data: data});
            return next();
        })
        .catch((error: any) => {
            res.send(400, {status: 'error', data: {message: error.message, code: error.code}});
            return next();
        })
    }
    
}