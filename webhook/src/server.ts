'use strict';

import { plugins, createServer } from 'restify';
import * as mongoose from 'mongoose';
import * as router from './routes'
import config from './config';

const server = createServer({
    name    : config.name,
    version : config.version
});

server.use(plugins.acceptParser(server.acceptable));

server.listen(config.port, () => {

    /**
     * Initiate connection to database
     */
    (<any>mongoose).Promise = config.db.mongo.options.promiseLibrary;
    mongoose.connect(config.db.mongo.uri, config.db.mongo.options);

    const db = mongoose.connection

    db.on('error', (err: any) => {
        if (err.message.code === 'ETIMEDOUT' || err.name === 'MongoNetworkError') {
            console.log('An error occurred while connecting. Retrying...')
            mongoose.connect(config.db.mongo.uri, config.db.mongo.options)
        }

        console.log(err)
    })

    db.once('open', () => {

        /**
         * Register routes for requests handling
         */
        router.register(server)

        console.log(`Server is listening on port ${config.port}`)

    })

})