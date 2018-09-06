'use strict';

import * as restify from 'restify';
import config from './config';


const router = require('routes');

const server = restify.createServer({
    name    : config.name,
    version : config.version
})

server.use(restify.plugins.jsonBodyParser())
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.fullResponse())

server.listen(config.port, () => {
    /**
     * Initiate connection to database
     */
    // mongoose.Promise = config.db.mongo.options.promiseLibrary;
    // mongoose.connect(config.db.mongo.uri, config.db.mongo.options)

    // const db = mongoose.connection

    // db.on('error', (err) => {
    //     if (err.message.code === 'ETIMEDOUT' || err.name === 'MongoNetworkError') {
    //         console.log('An error occurred while connecting. Retrying...')
    //         mongoose.connect(config.db.mongo.uri, config.db.mongo.options)
    //     }

    //     console.log(err)
    // })

    // db.once('open', () => {

    //     /**
    //      * Register routes for requests handling
    //      */
    //     router(server)

    //     console.log(`Server is listening on port ${config.port}`)

    // })

})