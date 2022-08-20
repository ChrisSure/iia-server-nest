import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RegionService } from '../region/region.service';
import { Region } from '../region/interfaces/region.interface';
import { PointBehaviourService } from '../point-behaviour/point-behaviour.service';
import { AlarmService } from '../alarm/alarm.service';
import { CreateAlarmDto } from '../../repositories/alarm/dtos/create-alarm.dto';
import { CreateUnitDto } from '../../repositories/unit/dtos/create-unit.dto';
import { AlarmRepository } from '../../repositories/alarm/alarm.repository';
import { UnitRepository } from '../../repositories/unit/unit.repository';
import { Alarm } from '../../repositories/alarm/schemas/alarm.schema';
import { Unit } from '../../repositories/unit/schemas/unit.schema';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private _regionService: RegionService;
  private _pointBehaviourService: PointBehaviourService;
  private _alarmService: AlarmService;
  private _alarmRepository: AlarmRepository;
  private _unitRepository: UnitRepository;
  currentDate: Date;

  constructor(
    regionService: RegionService,
    pointBehaviourService: PointBehaviourService,
    alarmService: AlarmService,
    alarmRepository: AlarmRepository,
    unitRepository: UnitRepository,
  ) {
    this._regionService = regionService;
    this._pointBehaviourService = pointBehaviourService;
    this._alarmService = alarmService;
    this._alarmRepository = alarmRepository;
    this._unitRepository = unitRepository;
    this.currentDate = new Date();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCronAlarm(): Promise<number> {
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
      const lastAlarm: Alarm = await this._alarmRepository.findLast();
      const lastUnit: Unit = await this._unitRepository.findLast();

      const isAlarmGone: boolean = await this._alarmService.isAlarmGone(
        lastAlarm.date,
      );
      if (!isAlarmGone && result !== 100) {
        result = 0;
      }
      if (result === 100 && isAlarmGone) {
        const createAlarmDto: CreateAlarmDto = { date: new Date() };
        await this._alarmRepository.create(createAlarmDto);
      }

      //await messengerNotifyActionModule.messengerNotifyAction(result, lastUnit.point);

      const createUnitDto: CreateUnitDto = { point: result, date: new Date() };
      await this._unitRepository.create(createUnitDto);

      //this.logger.debug(lastUnit);

      return result;
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleCronGarbage() {
    this.logger.debug('Garbage');
  }
}
