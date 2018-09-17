'use strict';

import { Request, Response, Next } from "restify";
import { addWebhook, fetchWebhooks } from '../lib/twitter';

class WebhooksController {
    protected twitter: any;

    constructor() {}

    fetchAll(req: Request, res: Response, next: Next) {
        fetchWebhooks().then(data => {
            res.send(200, {status: 'success', data: data});
            return next();
        })
        .catch(error => {
            res.send(400, {status: 'error', message: error.message})
        })
    }

    add(req: Request, res: Response, next: Next) {
        addWebhook(req.params.url).then(data => {
            res.send(200, {status: 'success', data: data});
            return next();
        })
        .catch(error => {
            res.send(400, {status: 'error', message: error.message})
        })
    }
    
}

export default WebhooksController;