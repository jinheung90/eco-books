import { Get, Injectable } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Injectable()
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
