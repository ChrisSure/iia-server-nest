import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RegionService } from '../region/region.service';
import { Region } from '../../interfaces/region/region.interface';
import { PointBehaviourService } from '../point-behaviour/point-behaviour.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private _regionService: RegionService;
  private _pointBehaviourService: PointBehaviourService;

  constructor(
    regionService: RegionService,
    pointBehaviourService: PointBehaviourService,
  ) {
    this._regionService = regionService;
    this._pointBehaviourService = pointBehaviourService;
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCronAlarm() {
    try {
      const regions: Array<Region> = await this._regionService.getRegions();
      const biggerPoint: number = await this._regionService.getBiggerPoint(
        regions,
      );
      const result = await this._pointBehaviourService.start(
        biggerPoint,
        regions,
      );
      this.logger.debug(result);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleCronGarbage() {
    this.logger.debug('Garbage');
  }
}
