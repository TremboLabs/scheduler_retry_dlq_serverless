import { Context, ScheduledEvent } from "aws-lambda";
import { SQS } from "aws-sdk";

const hello = async (_: ScheduledEvent, context: Context) => {
    try {
    // Check if exists failed messages in DLQ
    const sqs = new SQS();
    const clientId = context?.invokedFunctionArn?.split(':')[4]
    const failedMessages = await sqs.receiveMessage({
        QueueUrl: `https://sqs.us-east-1.amazonaws.com/${clientId}/main-queue-dlq`,
        MaxNumberOfMessages: 10
    }).promise();
    console.log('failedMessages', failedMessages)
    // If exists, send to main queue
    if (failedMessages?.Messages?.length) {
        const sended = await sqs.sendMessageBatch({
            QueueUrl: `https://sqs.us-east-1.amazonaws.com/${clientId}/main-queue`,
            Entries: failedMessages.Messages.map((message, index) => ({
                Id: index.toString(),
                MessageBody: message.Body
            }))
        }).promise();
        console.log('sended', sended)
        // Delete messages from DLQ
        const deleted = await sqs.deleteMessageBatch({
            QueueUrl: `https://sqs.us-east-1.amazonaws.com/${clientId}/main-queue-dlq`,
            Entries: failedMessages.Messages.map((message, index) => ({
                Id: index.toString(),
                ReceiptHandle: message.ReceiptHandle
            }))
        }).promise();
        console.log('deleted', deleted)
    }
    } catch(err) {
        console.log('err', err)
    }
}

export const main = hello;
