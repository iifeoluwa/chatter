'use strict';

import { Request, Response, Next } from "restify";
import { createHash, IncomingMessageData, fetchMessageData } from "../lib/twitter";
import { queueInvalidCommand, putUserOnline, sendMessageToRecipient, takeUserOffline } from "../lib/queue";
import { isOnline } from "../lib/redis";
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
            // When user is online, route all messages to person they're connected to
            // When not online, treat every message as a command and attemt to handle accordingly
            isOnline(senderId).then(user => {
                if(message.toLocaleLowerCase() === 'offline') {
                    takeUserOffline(senderId);
                } else {
                    sendMessageToRecipient(message, senderId);
                }
            })
            .catch(error => {
                switch(message.toLocaleLowerCase()) {
                    case 'online':
                        putUserOnline(senderId);
                        break;
                    case 'offline':
                        takeUserOffline(senderId);
                        break;
                    default:
                        queueInvalidCommand(senderId);
                        break;
                }
            })
        }

        res.json(200, {})
        return next();
        
    }
}