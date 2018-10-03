'use strict';

import * as restify from 'restify';
import { WebhooksController, EventsController } from '../controllers'

const Webhooks = new WebhooksController();
const Events = new EventsController();

export function register (server: restify.Server) {
    server.get('/', (req, res, next) => { 
        res.send(200, {status: 'success', data: 'You are home.'});
        return next();
    });
    server.post('/webhooks', Webhooks.add);
    server.get('/webhooks', Webhooks.fetchAll);
    server.get('/events/twitter', Events.verifyCRCToken);
}