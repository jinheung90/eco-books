import { Controller, Get, Injectable } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';


@Controller()
export class ExternalClientsHealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly configService: ConfigService
  ) {}

  @Get('health/external-clients')
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('user-service',
        this.configService.get<string>('USER_SERVICE_APP') + "/actuator/health")
    ]);
  }
}
