

import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
        sqs: {
            batchSize: 10,
            functionResponseType: 'ReportBatchItemFailures',
            arn: {
                'Fn::GetAtt': ['mainQueue', 'Arn'],
            },
        }
    },
  ],
};
