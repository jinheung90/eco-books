import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller()
export class HealthCheckController {
  constructor(private readonly health: HealthCheckService) {
  }

  @Get('/health/app')
  @HealthCheck()
  checkMyAppHealth() {
    return {
      status: "up"
    }
  }


}
