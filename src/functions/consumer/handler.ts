import { SQSEvent } from 'aws-lambda';

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const hello = async (event: SQSEvent) => {
    const failedMessagesIds = []

    for(const record of event.Records) {
        try {
            console.log(record.body);
            if (randomInt(0, 1)) {
                throw new Error('test');
            }
        } catch(err) {
            failedMessagesIds.push(record.messageId)
        }
    }

    return {
        batchItemFailures: failedMessagesIds?.map((id) => ({ itemIdentifier: id })),
      }
}

export const main = hello;
