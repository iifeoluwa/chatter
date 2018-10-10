'use strict';

import { Request, Response, Next } from "restify";
import { createHash } from "../lib/twitter";
import { timingSafeEqual } from "crypto";

export function validateRequest (req: Request, res: Response, next: Next) {
    const signature = req.header('x-twitter-webhooks-signature', null);
    
    if (signature) {
        const hash = createHash(req.body);
        const signatureHash = signature.substring(signature.indexOf('=') + 1);
        
        if (timingSafeEqual(Buffer.from(hash), Buffer.from(signatureHash))) {
            return next();
        }

        res.json(401, {status: 'errror', message: 'validation failed'});
        return next(false);
    }

    res.json(400, {status: 'error', message: "fuck off, you're not from twitter"});
    return next(false);

}

export function rawBody (req: Request, res: Response, next: Next) {
    let raw = '';
    req.on('data', function(data) {
        raw += data;
    });
    req.on('end', function() {
        req.body = raw;
        next();
    });
}