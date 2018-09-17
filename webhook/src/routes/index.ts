'use strict';

import * as restify from 'restify';
import WebhooksController from '../controllers/webhooks'

const Webhooks = new WebhooksController();

export function register (server: restify.Server) {
    server.get('/webhooks', Webhooks.fetchAll);
    server.post('/webhooks', Webhooks.add);
}