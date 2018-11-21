import { sendMessage, buildMessageBody } from "../util/twitter"
import { Messages } from '../config/messages'

interface InvalidConsumer {
    id: string;
    data: {
        user: string;
    }
    progress ?: Function;
}

export default function(job: InvalidConsumer): Promise<any> {
    const messageEvent = buildMessageBody(Messages.INVALID_COMMAND, job.data.user);
    return sendMessage(messageEvent)
        .then(() => {})
        .catch(error => Promise.reject(error));
}