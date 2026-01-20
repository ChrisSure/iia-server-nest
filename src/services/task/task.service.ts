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
import { MessengerService } from '../messenger/messenger.service';
import { StatisticService } from '../statistic/statistic.service';
import { Statistic } from '../statistic/interfaces/statistic.interface';
import {
  ALARM_STATE_ACTIVE,
  ALARM_STATE_RESET,
} from './constants/alarm-states';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private _regionService: RegionService;
  private _pointBehaviourService: PointBehaviourService;
  private _alarmService: AlarmService;
  private _messengerService: MessengerService;
  private _statisticService: StatisticService;
  private _alarmRepository: AlarmRepository;
  private _unitRepository: UnitRepository;
  currentDate: Date;

  constructor(
    regionService: RegionService,
    pointBehaviourService: PointBehaviourService,
    alarmService: AlarmService,
    messengerService: MessengerService,
    statisticService: StatisticService,
    alarmRepository: AlarmRepository,
    unitRepository: UnitRepository,
  ) {
    this._regionService = regionService;
    this._pointBehaviourService = pointBehaviourService;
    this._alarmService = alarmService;
    this._messengerService = messengerService;
    this._statisticService = statisticService;
    this._alarmRepository = alarmRepository;
    this._unitRepository = unitRepository;
    this.currentDate = new Date();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCronAlarm(): Promise<number> {
    try {
      // Get Regions list
      const regions: Array<Region> = await this._regionService.getRegions();
      if (regions) {
        // Get bigger point from regions list
        const biggerPoint: number = await this._regionService.getBiggerPoint(
          regions,
        );

        // Get All alarms
        const alarms = await this._alarmRepository.getAll();

        // Get Statistic report
        const statisticReport: Statistic =
          await this._statisticService.getReport(alarms);

        // Get result based on different point behaviours
        let result: number = await this._pointBehaviourService.start(
          biggerPoint,
          regions,
          this.currentDate,
          statisticReport,
        );

        // Get last alarm
        const lastAlarm: Alarm = await this._alarmRepository.findLast();

        if (lastAlarm) {
          // Check if alarm gone
          const isAlarmGone: boolean = await this._alarmService.isAlarmGone(
            lastAlarm.date,
          );
          // Check if alarm gone and result in not max alarm state then reset it to not notify users
          if (!isAlarmGone && result !== ALARM_STATE_ACTIVE) {
            result = ALARM_STATE_RESET;
          }
          // Create alarm
          if (result === ALARM_STATE_ACTIVE && isAlarmGone) {
            const createAlarmDto: CreateAlarmDto = { date: new Date() };
            await this._alarmRepository.create(createAlarmDto);
          }
        }

        // Get last unit
        const lastUnit: Unit = await this._unitRepository.findLast();
        const lastUnitRecent: Unit =
          await this._unitRepository.findLastFromRecent();

        // Send notification via Telegram
        if (lastUnit) {
          await this._messengerService.telegramNotify(
            result,
            lastUnit.point,
            lastUnitRecent,
          );
        }

        // Create Unit
        const createUnitDto: CreateUnitDto = {
          point: result,
          date: new Date(),
        };
        await this._unitRepository.create(createUnitDto);
        return result;
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Cron(CronExpression.EVERY_3_HOURS)
  async handleCronGarbage() {
    await this._unitRepository.removeAllUnits();
    this.logger.debug('Garbage');
  }
}
