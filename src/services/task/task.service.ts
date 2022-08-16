import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RegionService } from '../region/region.service';
import { Region } from '../../interfaces/region/region.interface';
import { PointBehaviourService } from '../point-behaviour/point-behaviour.service';
import { AlarmService } from '../alarm/alarm.service';
import { UnitService } from '../alarm/unit.service';
import { CreateAlarmDto } from '../../interfaces/alarm/create-alarm.dto';
import { CreateUnitDto } from '../../interfaces/unit/create-unit.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private _regionService: RegionService;
  private _pointBehaviourService: PointBehaviourService;
  private _alarmService: AlarmService;
  private _unitService: UnitService;
  currentDate: Date;

  constructor(
    regionService: RegionService,
    pointBehaviourService: PointBehaviourService,
    alarmService: AlarmService,
    unitService: UnitService,
  ) {
    this._regionService = regionService;
    this._pointBehaviourService = pointBehaviourService;
    this._alarmService = alarmService;
    this._unitService = unitService;
    this.currentDate = new Date();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCronAlarm() {
    try {
      const regions: Array<Region> = await this._regionService.getRegions();
      const biggerPoint: number = await this._regionService.getBiggerPoint(
        regions,
      );
      let result: number = await this._pointBehaviourService.start(
        biggerPoint,
        regions,
        this.currentDate,
      );
      const lastAlarm = await this._alarmService.findLast();
      const lastUnit = await this._unitService.findLast();

      const isAlarmGone = await this._alarmService.isAlarmGone(lastAlarm.date);
      if (!isAlarmGone && result !== 100) {
        result = 0;
      }
      if (result === 100 && isAlarmGone) {
        const createAlarmDto: CreateAlarmDto = { date: new Date() };
        await this._alarmService.create(createAlarmDto);
      }

      //await messengerNotifyActionModule.messengerNotifyAction(result, lastResult.result);

      const createUnitDto: CreateUnitDto = { point: result, date: new Date() };
      await this._unitService.create(createUnitDto);

      this.logger.debug(lastUnit);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleCronGarbage() {
    this.logger.debug('Garbage');
  }
}
