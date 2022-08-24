import { TasksService } from '../task.service';
import { RegionService } from '../../region/region.service';
import { PointBehaviourService } from '../../point-behaviour/point-behaviour.service';
import { AlarmService } from '../../alarm/alarm.service';
import { AlarmRepository } from '../../../repositories/alarm/alarm.repository';
import { UnitRepository } from '../../../repositories/unit/unit.repository';
import { Region } from '../../region/interfaces/region.interface';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Alarm } from '../../../repositories/alarm/schemas/alarm.schema';
import { Unit } from '../../../repositories/unit/schemas/unit.schema';
import { regionsMock } from './mock/regions.mock';
import { MessengerService } from '../../messenger/messenger.service';

describe('TasksService', () => {
  let tasksService: TasksService;
  let regionService: RegionService;
  let pointBehaviourService: PointBehaviourService;
  let alarmService: AlarmService;
  let messengerService: MessengerService;
  let alarmRepository: AlarmRepository;
  let unitRepository: UnitRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [],
      providers: [
        TasksService,
        RegionService,
        PointBehaviourService,
        AlarmService,
        MessengerService,
        AlarmRepository,
        { provide: getModelToken(Alarm.name), useValue: jest.fn() },
        UnitRepository,
        { provide: getModelToken(Unit.name), useValue: jest.fn() },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    regionService = module.get<RegionService>(RegionService);
    pointBehaviourService = module.get<PointBehaviourService>(
      PointBehaviourService,
    );
    alarmService = module.get<AlarmService>(AlarmService);
    messengerService = module.get<MessengerService>(MessengerService);
    alarmRepository = module.get<AlarmRepository>(AlarmRepository);
    unitRepository = module.get<UnitRepository>(UnitRepository);
  });

  it('handleCronAlarm', async () => {
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
    const findLastAlarmPromise = new Promise((resolve) => {
      const alarm: Alarm = { date: new Date(new Date().getTime() - 3600000) };
      resolve(alarm);
    });
    const isAlarmUnitPromise = new Promise((resolve) => {
      const unit: Unit = { point: 50, date: new Date() };
      resolve(unit);
    });
    const createAlarmPromise = new Promise((resolve) => {
      const alarm: Alarm = { date: new Date(new Date().getTime() - 3600000) };
      resolve(alarm);
    });
    const createUnitPromise = new Promise((resolve) => {
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

    const response: number = await tasksService.handleCronAlarm();
    expect(response).toEqual(90);
  });

  it('handleCronAlarm is alarm not gone', async () => {
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
    const findLastAlarmPromise = new Promise((resolve) => {
      const alarm: Alarm = { date: new Date(new Date().getTime() - 3600000) };
      resolve(alarm);
    });
    const isAlarmUnitPromise = new Promise((resolve) => {
      const unit: Unit = { point: 50, date: new Date() };
      resolve(unit);
    });
    const createAlarmPromise = new Promise((resolve) => {
      const alarm: Alarm = { date: new Date(new Date().getTime() - 3600000) };
      resolve(alarm);
    });
    const createUnitPromise = new Promise((resolve) => {
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

    const response: number = await tasksService.handleCronAlarm();
    expect(response).toEqual(0);
  });

  it('handleCronAlarm is alarm not gone bur result 100', async () => {
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
    const findLastAlarmPromise = new Promise((resolve) => {
      const alarm: Alarm = { date: new Date(new Date().getTime() - 3600000) };
      resolve(alarm);
    });
    const isAlarmUnitPromise = new Promise((resolve) => {
      const unit: Unit = { point: 50, date: new Date() };
      resolve(unit);
    });
    const createAlarmPromise = new Promise((resolve) => {
      const alarm: Alarm = { date: new Date(new Date().getTime() - 3600000) };
      resolve(alarm);
    });
    const createUnitPromise = new Promise((resolve) => {
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

    const response: number = await tasksService.handleCronAlarm();
    expect(response).toEqual(100);
  });
});
