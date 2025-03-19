import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

const DATABASE_KEY = 'database';

@Controller({
  path: 'health',
  version: VERSION_NEUTRAL,
})
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {
  }

  @HttpCode(HttpStatus.OK)
  @Get('/liveness')
  @HealthCheck()
  checkLiveness() {
    return null;
  }

  @Get('/readiness')
  @HealthCheck()
  checkReadiness() {
    return this.health.check([() => this.db.pingCheck(DATABASE_KEY)]);
  }
}
