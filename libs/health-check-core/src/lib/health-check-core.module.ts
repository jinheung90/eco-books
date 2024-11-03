import { Module } from '@nestjs/common';
import { HealthCheckController } from './controller/health-check-controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  controllers: [HealthCheckController],
  providers: [],
  exports: [],
})
export class HealthCheckCoreModule {}
