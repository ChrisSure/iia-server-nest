import { TasksService } from '../task.service';
import { RegionService } from '../../region/region.service';
import { PointBehaviourService } from '../../point-behaviour/point-behaviour.service';
import { AlarmService } from '../../alarm/alarm.service';
import { AlarmRepositoryPort } from '../../../repositories/alarm/interface/alarm-repository.interface';
import { UnitRepositoryPort } from '../../../repositories/unit/interface/unit-repository.interface';
import { Region } from '../../region/interfaces/region.interface';
import { Test } from '@nestjs/testing';
import { AlarmRecord } from '../../../repositories/alarm/interface/alarm.interface';
import { Unit } from '../../../repositories/unit/interface/unit.interface';
import { regionsMock } from './mock/regions.mock';
import { MessengerService } from '../../messenger/messenger.service';
import { StatisticService } from '../../statistic/statistic.service';
import { Statistic } from '../../statistic/interfaces/statistic.interface';
import {
  ALARM_REPOSITORY,
  UNIT_REPOSITORY,
} from '../../../repositories/repository.tokens';

describe('TasksService', () => {
  let tasksService: TasksService;
  let regionService: RegionService;
  let pointBehaviourService: PointBehaviourService;
  let alarmService: AlarmService;
  let messengerService: MessengerService;
  let statisticService: StatisticService;
  let alarmRepository: AlarmRepositoryPort;
  let unitRepository: UnitRepositoryPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [],
      providers: [
        TasksService,
        RegionService,
        PointBehaviourService,
        AlarmService,
        MessengerService,
        StatisticService,
        {
          provide: ALARM_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findLast: jest.fn(),
            getAll: jest.fn(),
          },
        },
        {
          provide: UNIT_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findLast: jest.fn(),
            findLastFromRecent: jest.fn(),
            removeAllUnits: jest.fn(),
          },
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    regionService = module.get<RegionService>(RegionService);
    pointBehaviourService = module.get<PointBehaviourService>(
      PointBehaviourService,
    );
    alarmService = module.get<AlarmService>(AlarmService);
    messengerService = module.get<MessengerService>(MessengerService);
    statisticService = module.get<StatisticService>(StatisticService);
    alarmRepository = module.get<AlarmRepositoryPort>(ALARM_REPOSITORY);
    unitRepository = module.get<UnitRepositoryPort>(UNIT_REPOSITORY);
  });

  it('handleCronAlarm', async () => {
    const getReportPromise = new Promise((resolve) => {
      const statistic: Statistic = {
        firstMaxHour: 12,
        secondMaxHour: 8,
        maxDay: 0,
      };
      resolve(statistic);
    });
    const getRegionsPromise = new Promise((resolve) => {
      const regions: Array<Region> = regionsMock();
      resolve(regions);
    });
    const getBiggerPointPromise = new Promise((resolve) => {
      resolve(90);
    });
    const startPromise = new Promise((resolve) => {
      resolve(90);
    });
    const isAlarmGonePromise = new Promise((resolve) => {
      resolve(true);
    });
    const getAllAlarmsPromise = new Promise((resolve) => {
      const alarm1: AlarmRecord = {
        date: new Date(new Date().getTime() - 3600000),
      };
      const alarm2: AlarmRecord = {
        date: new Date(new Date().getTime() - 3610000),
      };
      resolve([alarm1, alarm2]);
    });
    const findLastAlarmPromise = new Promise((resolve) => {
      const alarm: AlarmRecord = {
        date: new Date(new Date().getTime() - 3600000),
      };
      resolve(alarm);
    });
    const isAlarmUnitPromise = new Promise((resolve) => {
      const unit: Unit = { point: 50, date: new Date() };
      resolve(unit);
    });
    const createAlarmPromise = new Promise((resolve) => {
      const alarm: AlarmRecord = {
        date: new Date(new Date().getTime() - 3600000),
      };
      resolve(alarm);
    });
    const createUnitPromise = new Promise((resolve) => {
      const unit: Unit = { point: 50, date: new Date() };
      resolve(unit);
    });

    const lastUnitRecentPromise = new Promise((resolve) => {
      const unit: Unit = { point: 50, date: new Date() };
      resolve(unit);
    });

    jest
      .spyOn(regionService, 'getBiggerPoint')
      .mockImplementation(() => getBiggerPointPromise.then());
    jest
      .spyOn(alarmRepository, 'findLast')
      .mockImplementation(() => findLastAlarmPromise.then());
    jest
      .spyOn(unitRepository, 'findLast')
      .mockImplementation(() => isAlarmUnitPromise.then());
    jest
      .spyOn(alarmRepository, 'getAll')
      .mockImplementation(() => getAllAlarmsPromise.then());
    jest
      .spyOn(statisticService, 'getReport')
      .mockImplementation(() => getReportPromise.then());
    jest
      .spyOn(regionService, 'getRegions')
      .mockImplementation(() => getRegionsPromise.then());
    jest
      .spyOn(pointBehaviourService, 'start')
      .mockImplementation(() => startPromise.then());
    jest
      .spyOn(alarmService, 'isAlarmGone')
      .mockImplementation(() => isAlarmGonePromise.then());
    jest
      .spyOn(alarmRepository, 'create')
      .mockImplementation(() => createAlarmPromise.then());
    jest.spyOn(messengerService, 'telegramNotify').mockImplementation();
    jest
      .spyOn(unitRepository, 'create')
      .mockImplementation(() => createUnitPromise.then());
    jest
      .spyOn(unitRepository, 'findLastFromRecent')
      .mockImplementation(() => lastUnitRecentPromise.then());

    const response: number = await tasksService.handleCronAlarm();
    expect(response).toEqual(90);
  });

  it('handleCronAlarm is alarm not gone', async () => {
    const getReportPromise = new Promise((resolve) => {
      const statistic: Statistic = {
        firstMaxHour: 12,
        secondMaxHour: 8,
        maxDay: 0,
      };
      resolve(statistic);
    });
    const getRegionsPromise = new Promise((resolve) => {
      const regions: Array<Region> = regionsMock();
      resolve(regions);
    });
    const getBiggerPointPromise = new Promise((resolve) => {
      resolve(90);
    });
    const startPromise = new Promise((resolve) => {
      resolve(90);
    });
    const isAlarmGonePromise = new Promise((resolve) => {
      resolve(false);
    });
    const getAllAlarmsPromise = new Promise((resolve) => {
      const alarm1: AlarmRecord = {
        date: new Date(new Date().getTime() - 3600000),
      };
      const alarm2: AlarmRecord = {
        date: new Date(new Date().getTime() - 3610000),
      };
      resolve([alarm1, alarm2]);
    });
    const findLastAlarmPromise = new Promise((resolve) => {
      const alarm: AlarmRecord = {
        date: new Date(new Date().getTime() - 3600000),
      };
      resolve(alarm);
    });
    const isAlarmUnitPromise = new Promise((resolve) => {
      const unit: Unit = { point: 50, date: new Date() };
      resolve(unit);
    });
    const createAlarmPromise = new Promise((resolve) => {
      const alarm: AlarmRecord = {
        date: new Date(new Date().getTime() - 3600000),
      };
      resolve(alarm);
    });
    const createUnitPromise = new Promise((resolve) => {
      const unit: Unit = { point: 50, date: new Date() };
      resolve(unit);
    });

    const lastUnitRecentPromise = new Promise((resolve) => {
      const unit: Unit = { point: 50, date: new Date() };
      resolve(unit);
    });

    jest
      .spyOn(regionService, 'getRegions')
      .mockImplementation(() => getRegionsPromise.then());
    jest
      .spyOn(regionService, 'getBiggerPoint')
      .mockImplementation(() => getBiggerPointPromise.then());
    jest
      .spyOn(alarmRepository, 'findLast')
      .mockImplementation(() => findLastAlarmPromise.then());
    jest
      .spyOn(unitRepository, 'findLast')
      .mockImplementation(() => isAlarmUnitPromise.then());
    jest
      .spyOn(alarmRepository, 'getAll')
      .mockImplementation(() => getAllAlarmsPromise.then());
    jest
      .spyOn(statisticService, 'getReport')
      .mockImplementation(() => getReportPromise.then());
    jest
      .spyOn(regionService, 'getRegions')
      .mockImplementation(() => getRegionsPromise.then());
    jest
      .spyOn(pointBehaviourService, 'start')
      .mockImplementation(() => startPromise.then());
    jest
      .spyOn(alarmService, 'isAlarmGone')
      .mockImplementation(() => isAlarmGonePromise.then());
    jest
      .spyOn(alarmRepository, 'create')
      .mockImplementation(() => createAlarmPromise.then());
    jest.spyOn(messengerService, 'telegramNotify').mockImplementation();
    jest
      .spyOn(unitRepository, 'create')
      .mockImplementation(() => createUnitPromise.then());
    jest
      .spyOn(unitRepository, 'findLastFromRecent')
      .mockImplementation(() => lastUnitRecentPromise.then());

    const response: number = await tasksService.handleCronAlarm();
    expect(response).toEqual(0);
  });

  it('handleCronAlarm is alarm not gone bur result 100', async () => {
    const getReportPromise = new Promise((resolve) => {
      const statistic: Statistic = {
        firstMaxHour: 12,
        secondMaxHour: 8,
        maxDay: 0,
      };
      resolve(statistic);
    });
    const getRegionsPromise = new Promise((resolve) => {
      const regions: Array<Region> = regionsMock();
      resolve(regions);
    });
    const getBiggerPointPromise = new Promise((resolve) => {
      resolve(100);
    });
    const startPromise = new Promise((resolve) => {
      resolve(100);
    });
    const isAlarmGonePromise = new Promise((resolve) => {
      resolve(false);
    });
    const getAllAlarmsPromise = new Promise((resolve) => {
      const alarm1: AlarmRecord = {
        date: new Date(new Date().getTime() - 3600000),
      };
      const alarm2: AlarmRecord = {
        date: new Date(new Date().getTime() - 3610000),
      };
      resolve([alarm1, alarm2]);
    });
    const findLastAlarmPromise = new Promise((resolve) => {
      const alarm: AlarmRecord = {
        date: new Date(new Date().getTime() - 3600000),
      };
      resolve(alarm);
    });
    const isAlarmUnitPromise = new Promise((resolve) => {
      const unit: Unit = { point: 50, date: new Date() };
      resolve(unit);
    });
    const createAlarmPromise = new Promise((resolve) => {
      const alarm: AlarmRecord = {
        date: new Date(new Date().getTime() - 3600000),
      };
      resolve(alarm);
    });
    const createUnitPromise = new Promise((resolve) => {
      const unit: Unit = { point: 50, date: new Date() };
      resolve(unit);
    });

    const lastUnitRecentPromise = new Promise((resolve) => {
      const unit: Unit = { point: 50, date: new Date() };
      resolve(unit);
    });

    jest
      .spyOn(regionService, 'getRegions')
      .mockImplementation(() => getRegionsPromise.then());
    jest
      .spyOn(regionService, 'getBiggerPoint')
      .mockImplementation(() => getBiggerPointPromise.then());
    jest
      .spyOn(alarmRepository, 'findLast')
      .mockImplementation(() => findLastAlarmPromise.then());
    jest
      .spyOn(unitRepository, 'findLast')
      .mockImplementation(() => isAlarmUnitPromise.then());
    jest
      .spyOn(alarmRepository, 'getAll')
      .mockImplementation(() => getAllAlarmsPromise.then());
    jest
      .spyOn(statisticService, 'getReport')
      .mockImplementation(() => getReportPromise.then());
    jest
      .spyOn(pointBehaviourService, 'start')
      .mockImplementation(() => startPromise.then());
    jest
      .spyOn(alarmService, 'isAlarmGone')
      .mockImplementation(() => isAlarmGonePromise.then());
    jest.spyOn(messengerService, 'telegramNotify').mockImplementation();
    jest
      .spyOn(alarmRepository, 'create')
      .mockImplementation(() => createAlarmPromise.then());
    jest
      .spyOn(unitRepository, 'create')
      .mockImplementation(() => createUnitPromise.then());
    jest
      .spyOn(unitRepository, 'findLastFromRecent')
      .mockImplementation(() => lastUnitRecentPromise.then());

    const response: number = await tasksService.handleCronAlarm();
    expect(response).toEqual(100);
  });
});
