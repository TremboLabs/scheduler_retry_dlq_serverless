import type { AWS } from '@serverless/typescript';

import consumer from '@functions/consumer';
import retrySchedule from '@functions/retrySchedule';

const serverlessConfiguration: AWS = {
  service: 'serverless-retry-strategy',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Resource: '*',
        Action: ['sqs:*']
      }
    ]
  },
  functions: { consumer, retrySchedule } as any,
  resources: {
    Resources: {
      dlqMainQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'main-queue-dlq',
        }
      },
      mainQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'main-queue',
          VisibilityTimeout: 30,
          RedrivePolicy: {
            deadLetterTargetArn: {
              'Fn::GetAtt': ['dlqMainQueue', 'Arn'],
            },
            maxReceiveCount: 5,
          }
        }
      },
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
