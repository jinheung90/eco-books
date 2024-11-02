import { Module } from '@nestjs/common';
import { AwsParameterStoreProvider } from './aws-parameter-store.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.chat-ws',
      load: [AwsParameterStoreProvider],
    }),],
  controllers: [],
  providers: [],
  exports: [],
})
export class AwsParameterStoreModule {}
