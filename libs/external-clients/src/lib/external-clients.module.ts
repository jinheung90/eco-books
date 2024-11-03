import { Module } from '@nestjs/common';
import { BookServiceClients } from './service/book-service.clients';
import { HttpModule } from '@nestjs/axios';
import { ExternalClientsHealthController } from './controller/external-clients-health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [HttpModule, TerminusModule],
  providers: [BookServiceClients],
  exports: [BookServiceClients],
  controllers: [ExternalClientsHealthController]
})
export class ExternalClientsModule {}
