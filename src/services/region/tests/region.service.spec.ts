import { RegionService } from '../region.service';
import { regionsMock } from './mock/regions.mock';
import { regionsFullMock } from './mock/regions-full.mock';
import { regionsBiggerMock } from './mock/regions-bigger.mock';
import axios, { AxiosResponse } from 'axios';
import { Region } from '../../../interfaces/region/region.interface';
jest.mock('axios');

describe('RegionService', () => {
  const service: RegionService = new RegionService();
  let mockedAxios: any;

  beforeAll(() => {
    jest.resetModules();
    jest.resetAllMocks();
    mockedAxios = axios as jest.Mocked<typeof axios>;
  });

  it('getBiggerPoint 1', async () => {
    const regions: Array<Region> = regionsBiggerMock();
    regions[0].enabled = true;
    regions[2].enabled = true;
    regions[12].enabled = true;
    regions[7].enabled = true;
    const response: number = await service.getBiggerPoint(regions);
    expect(response).toEqual(100);
  });

  it('getBiggerPoint 2', async () => {
    const regions: Array<Region> = regionsBiggerMock();
    regions[0].enabled = true;
    regions[2].enabled = true;
    regions[13].enabled = true;
    regions[21].enabled = true;
    const response: number = await service.getBiggerPoint(regions);
    expect(response).toEqual(50);
  });

  it('getBiggerPoint 3', async () => {
    const response: number = await service.getBiggerPoint(regionsBiggerMock());
    expect(response).toEqual(0);
  });

  it('getRegions', async () => {
    const axiosResponse: AxiosResponse = {
      data: regionsFullMock(),
      status: 200,
      statusText: 'OK',
      config: {},
      headers: {},
    };
    mockedAxios.get.mockResolvedValue(axiosResponse);

    const response = await service.getRegions();
    expect(response[0].id).toEqual(1);
    expect(response[0].key).toEqual('Вінницька область');
    expect(response[0].point).toEqual(50);

    expect(response[1].id).toEqual(2);
    expect(response[1].key).toEqual('Волинська область');
    expect(response[1].point).toEqual(80);

    expect(response[2].id).toEqual(3);
    expect(response[2].key).toEqual('Дніпропетровська область');
    expect(response[2].point).toEqual(10);

    expect(response[3].id).toEqual(4);
    expect(response[3].key).toEqual('Донецька область');
    expect(response[3].point).toEqual(0);
    expect(response[3].enabled).toBeTruthy();

    expect(response[4].id).toEqual(5);
    expect(response[4].key).toEqual('Житомирська область');
    expect(response[4].point).toEqual(40);

    expect(response[5].id).toEqual(6);
    expect(response[5].key).toEqual('Закарпатська область');
    expect(response[5].point).toEqual(90);

    expect(response[6].id).toEqual(7);
    expect(response[6].key).toEqual('Запорізька область');
    expect(response[6].point).toEqual(5);

    expect(response[7].id).toEqual(8);
    expect(response[7].key).toEqual('Івано-Франківська область');
    expect(response[7].point).toEqual(100);
    expect(response[7].enabled).not.toBeTruthy();

    expect(response[8].id).toEqual(9);
    expect(response[8].key).toEqual('Київська область');
    expect(response[8].point).toEqual(20);

    expect(response[9].id).toEqual(10);
    expect(response[9].key).toEqual('Кіровоградська область');
    expect(response[9].point).toEqual(15);
    expect(response[9].enabled).toBeTruthy();

    expect(response[10].id).toEqual(11);
    expect(response[10].key).toEqual('Луганська область');
    expect(response[10].point).toEqual(0);

    expect(response[11].id).toEqual(12);
    expect(response[11].key).toEqual('Львівська область');
    expect(response[11].point).toEqual(90);

    expect(response[12].id).toEqual(13);
    expect(response[12].key).toEqual('Миколаївська область');
    expect(response[12].point).toEqual(15);

    expect(response[13].id).toEqual(14);
    expect(response[13].key).toEqual('Одеська область');
    expect(response[13].point).toEqual(20);

    expect(response[14].id).toEqual(15);
    expect(response[14].key).toEqual('Полтавська область');
    expect(response[14].point).toEqual(10);

    expect(response[15].id).toEqual(16);
    expect(response[15].key).toEqual('Рівненська область');
    expect(response[15].point).toEqual(60);

    expect(response[16].id).toEqual(17);
    expect(response[16].key).toEqual('Сумська область');
    expect(response[16].point).toEqual(5);
    expect(response[16].enabled_at).toEqual('2022-08-13T11:23:10+00:00');

    expect(response[17].id).toEqual(18);
    expect(response[17].key).toEqual('Тернопільська область');
    expect(response[17].point).toEqual(90);
    expect(response[17].enabled).not.toBeTruthy();

    expect(response[18].id).toEqual(19);
    expect(response[18].key).toEqual('Харківська область');
    expect(response[18].point).toEqual(5);

    expect(response[19].id).toEqual(20);
    expect(response[19].key).toEqual('Херсонська область');
    expect(response[19].point).toEqual(5);

    expect(response[20].id).toEqual(21);
    expect(response[20].key).toEqual('Хмельницька область');
    expect(response[20].point).toEqual(65);

    expect(response[21].id).toEqual(22);
    expect(response[21].key).toEqual('Черкаська область');
    expect(response[21].point).toEqual(15);

    expect(response[22].id).toEqual(23);
    expect(response[22].key).toEqual('Чернівецька область');
    expect(response[22].point).toEqual(90);
    expect(response[22].disabled_at).toEqual('2022-08-13T05:18:32+00:00');

    expect(response[23].id).toEqual(24);
    expect(response[23].key).toEqual('Чернігівська область');
    expect(response[23].point).toEqual(15);
  });

  it('getRegionsLibrary', async () => {
    const response = await service.getRegionsLibrary();
    expect(response[0].id).toEqual(1);
    expect(response[0].name).toEqual('Вінницька область');
    expect(response[0].point).toEqual(50);

    expect(response[1].id).toEqual(2);
    expect(response[1].name).toEqual('Волинська область');
    expect(response[1].point).toEqual(80);

    expect(response[2].id).toEqual(3);
    expect(response[2].name).toEqual('Дніпропетровська область');
    expect(response[2].point).toEqual(10);

    expect(response[3].id).toEqual(4);
    expect(response[3].name).toEqual('Донецька область');
    expect(response[3].point).toEqual(0);

    expect(response[4].id).toEqual(5);
    expect(response[4].name).toEqual('Житомирська область');
    expect(response[4].point).toEqual(40);

    expect(response[5].id).toEqual(6);
    expect(response[5].name).toEqual('Закарпатська область');
    expect(response[5].point).toEqual(90);

    expect(response[6].id).toEqual(7);
    expect(response[6].name).toEqual('Запорізька область');
    expect(response[6].point).toEqual(5);

    expect(response[7].id).toEqual(8);
    expect(response[7].name).toEqual('Івано-Франківська область');
    expect(response[7].point).toEqual(100);

    expect(response[8].id).toEqual(9);
    expect(response[8].name).toEqual('Київська область');
    expect(response[8].point).toEqual(20);

    expect(response[9].id).toEqual(10);
    expect(response[9].name).toEqual('Кіровоградська область');
    expect(response[9].point).toEqual(15);

    expect(response[10].id).toEqual(11);
    expect(response[10].name).toEqual('Луганська область');
    expect(response[10].point).toEqual(0);

    expect(response[11].id).toEqual(12);
    expect(response[11].name).toEqual('Львівська область');
    expect(response[11].point).toEqual(90);

    expect(response[12].id).toEqual(13);
    expect(response[12].name).toEqual('Миколаївська область');
    expect(response[12].point).toEqual(15);

    expect(response[13].id).toEqual(14);
    expect(response[13].name).toEqual('Одеська область');
    expect(response[13].point).toEqual(20);

    expect(response[14].id).toEqual(15);
    expect(response[14].name).toEqual('Полтавська область');
    expect(response[14].point).toEqual(10);

    expect(response[15].id).toEqual(16);
    expect(response[15].name).toEqual('Рівненська область');
    expect(response[15].point).toEqual(60);

    expect(response[16].id).toEqual(17);
    expect(response[16].name).toEqual('Сумська область');
    expect(response[16].point).toEqual(5);

    expect(response[17].id).toEqual(18);
    expect(response[17].name).toEqual('Тернопільська область');
    expect(response[17].point).toEqual(90);

    expect(response[18].id).toEqual(19);
    expect(response[18].name).toEqual('Харківська область');
    expect(response[18].point).toEqual(5);

    expect(response[19].id).toEqual(20);
    expect(response[19].name).toEqual('Херсонська область');
    expect(response[19].point).toEqual(5);

    expect(response[20].id).toEqual(21);
    expect(response[20].name).toEqual('Хмельницька область');
    expect(response[20].point).toEqual(65);

    expect(response[21].id).toEqual(22);
    expect(response[21].name).toEqual('Черкаська область');
    expect(response[21].point).toEqual(15);

    expect(response[22].id).toEqual(23);
    expect(response[22].name).toEqual('Чернівецька область');
    expect(response[22].point).toEqual(90);

    expect(response[23].id).toEqual(24);
    expect(response[23].name).toEqual('Чернігівська область');
    expect(response[23].point).toEqual(15);
  });

  it('transformData', async () => {
    const response = await service.transformData(regionsMock());
    expect(response[0].id).toEqual(1);
    expect(response[0].key).toEqual('Вінницька область');
    expect(response[0].point).toEqual(50);

    expect(response[1].id).toEqual(2);
    expect(response[1].key).toEqual('Волинська область');
    expect(response[1].point).toEqual(80);

    expect(response[2].id).toEqual(3);
    expect(response[2].key).toEqual('Дніпропетровська область');
    expect(response[2].point).toEqual(10);

    expect(response[3].id).toEqual(4);
    expect(response[3].key).toEqual('Донецька область');
    expect(response[3].point).toEqual(0);
    expect(response[3].enabled).toBeTruthy();

    expect(response[4].id).toEqual(5);
    expect(response[4].key).toEqual('Житомирська область');
    expect(response[4].point).toEqual(40);

    expect(response[5].id).toEqual(6);
    expect(response[5].key).toEqual('Закарпатська область');
    expect(response[5].point).toEqual(90);

    expect(response[6].id).toEqual(7);
    expect(response[6].key).toEqual('Запорізька область');
    expect(response[6].point).toEqual(5);

    expect(response[7].id).toEqual(8);
    expect(response[7].key).toEqual('Івано-Франківська область');
    expect(response[7].point).toEqual(100);
    expect(response[7].enabled).not.toBeTruthy();

    expect(response[8].id).toEqual(9);
    expect(response[8].key).toEqual('Київська область');
    expect(response[8].point).toEqual(20);

    expect(response[9].id).toEqual(10);
    expect(response[9].key).toEqual('Кіровоградська область');
    expect(response[9].point).toEqual(15);
    expect(response[9].enabled).toBeTruthy();

    expect(response[10].id).toEqual(11);
    expect(response[10].key).toEqual('Луганська область');
    expect(response[10].point).toEqual(0);

    expect(response[11].id).toEqual(12);
    expect(response[11].key).toEqual('Львівська область');
    expect(response[11].point).toEqual(90);

    expect(response[12].id).toEqual(13);
    expect(response[12].key).toEqual('Миколаївська область');
    expect(response[12].point).toEqual(15);

    expect(response[13].id).toEqual(14);
    expect(response[13].key).toEqual('Одеська область');
    expect(response[13].point).toEqual(20);

    expect(response[14].id).toEqual(15);
    expect(response[14].key).toEqual('Полтавська область');
    expect(response[14].point).toEqual(10);

    expect(response[15].id).toEqual(16);
    expect(response[15].key).toEqual('Рівненська область');
    expect(response[15].point).toEqual(60);

    expect(response[16].id).toEqual(17);
    expect(response[16].key).toEqual('Сумська область');
    expect(response[16].point).toEqual(5);
    expect(response[16].enabled_at).toEqual('2022-08-13T11:23:10+00:00');

    expect(response[17].id).toEqual(18);
    expect(response[17].key).toEqual('Тернопільська область');
    expect(response[17].point).toEqual(90);
    expect(response[17].enabled).not.toBeTruthy();

    expect(response[18].id).toEqual(19);
    expect(response[18].key).toEqual('Харківська область');
    expect(response[18].point).toEqual(5);

    expect(response[19].id).toEqual(20);
    expect(response[19].key).toEqual('Херсонська область');
    expect(response[19].point).toEqual(5);

    expect(response[20].id).toEqual(21);
    expect(response[20].key).toEqual('Хмельницька область');
    expect(response[20].point).toEqual(65);

    expect(response[21].id).toEqual(22);
    expect(response[21].key).toEqual('Черкаська область');
    expect(response[21].point).toEqual(15);

    expect(response[22].id).toEqual(23);
    expect(response[22].key).toEqual('Чернівецька область');
    expect(response[22].point).toEqual(90);
    expect(response[22].disabled_at).toEqual('2022-08-13T05:18:32+00:00');

    expect(response[23].id).toEqual(24);
    expect(response[23].key).toEqual('Чернігівська область');
    expect(response[23].point).toEqual(15);
  });
});
