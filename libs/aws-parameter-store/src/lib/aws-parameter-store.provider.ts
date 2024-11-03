
import { GetParametersByPathCommand, SSMClient } from '@aws-sdk/client-ssm';

import { EnvironmentName } from '@eco-books/type-common';
import { fromContainerMetadata } from '@aws-sdk/credential-providers';
import * as process from 'process';
import { Logger } from '@nestjs/common';

export const AwsParameterStoreProvider = async () => {
  let clientConfig;
  const basePath = process.env['AWS_CONFIG_BASE_PATH'];
  const logger = new Logger(AwsParameterStoreProvider.name)
  logger.log(basePath);
  const command = new GetParametersByPathCommand({
    Path: basePath,
    Recursive: true,
  });
  if (process.env['APP_ENV'] === EnvironmentName.LOCAL) {
    clientConfig = {
      region:  process.env['AWS_REGION'],
      credentials: {
        accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
        secretAccessKey: process.env['AWS_SECRET_KEY'],
      },
    };
  } else {
    clientConfig = fromContainerMetadata({
      timeout: 1000,
      maxRetries: 0,
    });
  }
  const parameters = await new SSMClient(clientConfig)
    .send(command)
    .then((r) => {
      return r.Parameters;
    });
  logger.log(parameters.length)
  parameters.forEach((v) => {
    const parameterName = v.Name.replace(basePath, '');
    process.env[parameterName] = v.Value;
    if(process.env['APP_ENV'] === EnvironmentName.LOCAL) {
      logger.log(parameterName);
      logger.log(v.Value);
    }
  });
};
