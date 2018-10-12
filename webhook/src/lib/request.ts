import * as got from 'got';
import { createHmac } from 'crypto';
const OAuth = require('oauth-1.0a');

const oauth = OAuth({
	consumer: {
		key: process.env.TWITTER_CONSUMER_KEY,
		secret: process.env.TWITTER_CONSUMER_SECRET
	},
	signature_method: 'HMAC-SHA1',
	hash_function: (baseString: string, key: string) => createHmac('sha1', key).update(baseString).digest('base64')
});

const token = {
	key: process.env.TWITTER_ACCESS_TOKEN,
	secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

export interface RequestOptions {
    method: string,
    queryParams ?: Object,
    body ?: Object
}

export function hit(url: got.GotUrl, options: RequestOptions): got.GotPromise<object> {
    url = `https://api.twitter.com/1.1/${url}.json`;

    const requestOpts: any = {
        headers: oauth.toHeader(oauth.authorize({url, method: options.method}, token)),
        json: true,
        method: options.method
    };

    if(options.queryParams) requestOpts.query = options.queryParams;

    return got(url, requestOpts);
}