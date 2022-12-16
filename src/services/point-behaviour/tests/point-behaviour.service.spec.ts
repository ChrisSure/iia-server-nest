import { PointBehaviourService } from '../point-behaviour.service';
import { regionsMock } from './mock/regions.mock';
import { Region } from '../../region/interfaces/region.interface';
import { Statistic } from '../../statistic/interfaces/statistic.interface';

describe('PointBehaviourService', () => {
  const service: PointBehaviourService = new PointBehaviourService();
  const statistic: Statistic = {
    firstMaxHour: 12,
    secondMaxHour: 8,
    maxDay: 0,
  };

  it('start', async () => {
    const currentDate: Date = new Date('2022-06-18T13:24:00.397Z');
    const regions: Array<Region> = regionsMock();
    const response: number = await service.start(
      50,
      regions,
      currentDate,
      statistic,
    );
    expect(response).toEqual(50);
  });

  it('setActiveRegions', async () => {
    const regions: Array<Region> = regionsMock();
    regions[5].enabled = true;
    regions[10].enabled = true;
    const response: Array<Region> = await service.setActiveRegions(regions);
    expect(response[0].id).toEqual(6);
    expect(response[1].id).toEqual(11);
  });

  it('getRegionsKeys', async () => {
    const regions: Array<Region> = regionsMock();
    service.activeRegions = [regions[5], regions[6]];
    const response: Array<number> = await service.getRegionsKeys();
    expect(response.includes(6)).toBeTruthy();
    expect(response.includes(7)).toBeTruthy();
    expect(response.includes(17)).not.toBeTruthy();
  });

  it('regionValueExist true', async () => {
    const regionsArray: Array<number> = [13, 14, 1];
    const regionsKeys: Array<number> = [13, 14, 1];
    const response: boolean = await service.regionValueExist(
      regionsArray,
      regionsKeys,
    );
    expect(response).toBeTruthy();
  });

  it('regionValueExist false', async () => {
    const regionsArray: Array<number> = [13, 14, 1];
    const regionsKeys: Array<number> = [13, 14];
    const response: boolean = await service.regionValueExist(
      regionsArray,
      regionsKeys,
    );
    expect(response).not.toBeTruthy();
  });

  it('towardsBehaviour 40->50 true', async () => {
    const regions: Array<Region> = regionsMock();
    service.activeRegions = [regions[8], regions[9], regions[14], regions[21]];
    const response: number = await service.towardsBehaviour(40);
    expect(response).toEqual(50);
  });

  it('towardsBehaviour 40->50 false', async () => {
    const regions: Array<Region> = regionsMock();
    service.activeRegions = [regions[0], regions[12], regions[4]];
    const response: number = await service.towardsBehaviour(40);
    expect(response).toEqual(40);
  });

  it('towardsBehaviour 80->85 true', async () => {
    const regions: Array<Region> = regionsMock();
    service.activeRegions = [regions[0], regions[12], regions[13]];
    const response: number = await service.towardsBehaviour(80);
    expect(response).toEqual(85);
  });

  it('towardsBehaviour 80->85 false', async () => {
    const regions: Array<Region> = regionsMock();
    service.activeRegions = [regions[1], regions[4]];
    const response: number = await service.towardsBehaviour(80);
    expect(response).toEqual(80);
  });

  it('timeBehaviour Monday', async () => {
    const currentDate: Date = new Date('2022-12-19T03:24:00.397Z');
    const response: number = await service.timeBehaviour(
      60,
      currentDate,
      statistic,
    );
    expect(response).toEqual(65);
  });

  it('start -> timeBehaviour 8 hour', async () => {
    const currentDate: Date = new Date('2022-06-19T08:00:00.397Z');
    const regions: Array<Region> = regionsMock();
    regions[0].enabled = true;
    const response: number = await service.start(
      50,
      regions,
      currentDate,
      statistic,
    );
    expect(response).toEqual(55);
  });

  it('timeBehaviour 12 hour', async () => {
    const currentDate: Date = new Date('2022-06-19T12:01:01.397Z');
    const response: number = await service.timeBehaviour(
      60,
      currentDate,
      statistic,
    );
    expect(response).toEqual(65);
  });

  it('timeBehaviour more than 80', async () => {
    const currentDate: Date = new Date('2022-06-19T14:24:00');
    const response: number = await service.timeBehaviour(
      85,
      currentDate,
      statistic,
    );
    expect(response).toEqual(85);
  });

  it('timeBehaviour not changed', async () => {
    const currentDate: Date = new Date('2022-06-19T13:24:00');
    const response: number = await service.timeBehaviour(
      50,
      currentDate,
      statistic,
    );
    expect(response).toEqual(50);
  });
});
