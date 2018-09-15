'use strict';

import TWIT from '../lib/twitter';

class WebhooksController {
    protected twitter: any;

    constructor() {
        this.twitter = TWIT;
    }

    add() {

    }

    fetchAll() {

    }
}

export default WebhooksController;