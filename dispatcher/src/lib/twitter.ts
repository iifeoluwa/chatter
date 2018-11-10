import { hit, RequestOptions } from './request'
import { Response, GotError } from 'got';

export function sendMessage(messageEvent: any) {
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

export function buildMessageBody(message: string, recipient: string) {
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