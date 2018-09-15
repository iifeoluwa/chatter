'use strict'

const config = {
    name: 'troulette',
    version: '1.0.0',
    port: process.env.PORT || '8080',
    db: {
        mongo: {
            uri: 'mongodb://mongo:27017',
            options: {
                promiseLibrary: Promise,
                autoReconnect: true,
                reconnectTries: 10,
                reconnectInterval: 2000,
                autoIndex: true,
            }
        }
    }
}

export default config;