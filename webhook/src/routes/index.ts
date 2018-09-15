'use strict';

import * as restify from 'restify';

export function register (server: restify.Server) {
    server.get('/', (req, res, next) => {
        res.send('hola')
    });
}