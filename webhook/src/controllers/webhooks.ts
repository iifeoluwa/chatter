'use strict';

import { Request, Response, Next } from "restify";
import { Twitter } from 'twit';
import { addWebhook, fetchWebhooks } from '../lib/twitter';

export class WebhooksController {

    constructor() {}

    fetchAll(req: Request, res: Response, next: Next) {
        fetchWebhooks().then((data: any)  => {
            res.send(200, {status: 'success', data: data});
            return next();
        })
        .catch((error: Twitter.Errors) => {
            console.log(error)
            res.send(400, {status: 'error', message: error.errors[0]})
        })
    }

    add(req: Request, res: Response, next: Next) {
        addWebhook(req.query.url).then((data: any) => {
            res.send(200, {status: 'success', data: data});
            return next();
        })
        .catch((error: Twitter.Errors) => {
            console.log(error)
            res.send(400, {status: 'error', message: error.errors[0]})
        })
    }
    
}