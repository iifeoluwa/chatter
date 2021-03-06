'use strict';

import { plugins, Server } from 'restify';
import { WebhooksController, EventsController } from '../controllers'
import { validateRequest, rawBody } from '../middleware';

const Webhooks = new WebhooksController();
const Events = new EventsController();

export function register (server: Server) {
    server.get('/', (req, res, next) => { 
        res.send(200, {status: 'success', data: 'You are home.'});
        return next();
    });
    server.post('/webhooks', [plugins.queryParser(), Webhooks.add]);
    server.get('/webhooks', Webhooks.fetchAll);
    server.put('/webhooks', [plugins.queryParser(), Webhooks.check]);
    server.get('/events/twitter', [plugins.queryParser(), Events.verifyCRCToken]);
    server.post('/events/twitter', [rawBody, validateRequest, Events.handleDirectMessage]);
    server.post('/subscriptions/twitter', Webhooks.subscribe);
}