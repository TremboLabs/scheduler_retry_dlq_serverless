

import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
        schedule: {
            rate: ['rate(10 minutes)'],
            enabled: true,
            description: 'Retry failed messages in DLQ'
        }
    },
  ],
};
