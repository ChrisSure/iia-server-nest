import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RegionService } from './region.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private _regionService: RegionService;

  constructor(regionService: RegionService) {
    this._regionService = regionService;
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCronAlarm() {
    const regions = await this._regionService.getRegions();
    console.log(regions);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleCronGarbage() {
    this.logger.debug('Garbage');
  }
}
