### Schedule retry for failed messages in Dead letter queue (SQS)

- Consumer
    - The consumer will read the message from the main queue, to testing porpuse, the consumer has a 50% chance to fail.
    - If the message fails, the consumer will retry 5 times, and if it still fails, the message will be sent to the dead letter queue.
    
- Scheduler
    - The scheduler will read the message from the dead letter queue, and if message exists, it will be sent to the main queue.


- This strategy is useful when you have a lot of messages in the dead letter queue, and you want to retry all of them without the need to manually send them to the main queue.
    - Advantages
        - Automation: By scheduling the Lambda function to run at specific intervals, you can automate the process of checking for and resolving message failures.
        - Reliability: If your system relies on messages to be processed correctly and in a timely manner, the DLQ can help ensure that failed messages are processed eventually. By using a Lambda function to move those messages back into the main queue, you're further reducing the chance of any messages being lost or delayed.
        - Scalability: If you have a high volume of messages coming through your system, it can be helpful to have an automated solution for dealing with any failures.
    - Cons:
        - Cost: Depending on how frequently you schedule the Lambda function to run and how many messages are being moved between queues, there could be a cost associated with this solution. Lambda pricing is based on the number of invocations, duration of the function running, and any associated resources (such as using SQS or other services).
        - Throttling: If your Lambda function is trying to move a large number of messages at once, it could be throttled by the SQS service. This could cause delays or failures in the Lambda function's execution.
        - Increased Complexity: Introducing a Lambda function to perform this type of operation adds another layer of complexity to your system. You'll need to ensure that the function is robust and reliable, and you'll need to monitor it for any errors or failures.
