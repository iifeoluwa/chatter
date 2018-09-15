'use strict';

import * as twit from 'twit';
import config from '../config/twitter';

const TWIT = new twit({
    consumer_key:         config.consumer_key,
    consumer_secret:      config.consumer_secret,
    access_token:         config.access_token,
    access_token_secret:  config.access_token_secret,
})

export default TWIT;