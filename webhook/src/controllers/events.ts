'use strict';

import { Request, Response, Next } from "restify";
import { createHash } from "../lib/twitter"

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
}