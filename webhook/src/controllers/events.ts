'use strict';

import { Request, Response, Next } from "restify";
import { createHash, IncomingMessageData, fetchMessageData, sendMessage } from "../lib/twitter"
import { queueInvalidCommand } from "../lib/queue"
import config from "../config/twitter"

export class EventsController {
    verifyCRCToken(req: Request, res: Response, next: Next) {
        if(req.query.crc_token) {
            const hash = createHash(req.query.crc_token);
            res.json(200, {response_token: `sha256=${hash}`});
            return next();
        }

        res.send(400, {status: 'error', message: 'missing crc token'});
        return next();
    }

    async handleDirectMessage(req: Request, res: Response, next: Next) {
        const {senderId, message}: IncomingMessageData = fetchMessageData(req.body.direct_message_events);

        // Don't proccess messages that are sent from us for now. Might handle them in the future.
        if (senderId !== config.account_id) {
            if (message.toLowerCase() === 'online') {

            } else {
                try {
                    queueInvalidCommand()
                } catch (error) {
                    console.log('Error occurred while sending message to user', error.message);
                }          

            }
        }

        res.json(200, {})
        return next();
        
    }
}