import { hit, RequestOptions } from './request'
import { Response, GotError } from 'got';
import { Messages } from '../config/twitter'

export function sendInvalidCommandMessage(userId: string) {
    const messageEvent = buildMessageBody(Messages.INVALID_COMMAND, userId);
    const path = 'direct_messages/events/new';

    return hit(path, {method: 'POST', body: messageEvent})
        .then((result: Response<object>) => {
            return result.body;
        })
        .catch((error: GotError)=> {
            console.log({error})
            throw error;
        });
}

function buildMessageBody(message: string, recipient: string) {
    return {
        event: {
            type: 'message_create',
            message_create: {
                target: {
                    recipient_id: recipient
                },
                message_data: {
                    text: message
                }
            }
        }
    };
}