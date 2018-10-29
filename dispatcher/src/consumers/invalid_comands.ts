import { sendInvalidCommandMessage } from "../lib/twitter"

interface InvalidConsumer {
    id: string;
    data: {
        user: string;
    }
    progress ?: Function;
}

export default function(job: InvalidConsumer): Promise<any> {
    return sendInvalidCommandMessage(job.data.user)
        .then(() => {})
        .catch(error => Promise.reject(error));
}