import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RegionBase } from './interfaces/region-base.interface';
import { Region } from './interfaces/region.interface';

@Injectable()
export class RegionService {
  async getRegions(): Promise<Array<Region>> {
    return axios
      .get('https://emapa.fra1.cdn.digitaloceanspaces.com/statuses.json')
      .then(async (response) => {
        return await this.transformData(response.data.states);
      })
      .catch(function (error) {
        throw new Error(error);
      });
  }

  async getBiggerPoint(regions: Array<Region>): Promise<number> {
    let biggerPoint = 0;
    regions.forEach((region) => {
      if (region.enabled && region.point > biggerPoint) {
        biggerPoint = region.point;
      }
    });
    return biggerPoint;
  }

  async transformData(data: any): Promise<Array<Region>> {
    const statesArray: Region[] = [];
    if (data) {
      const regions = await this.getRegionsLibrary();
      Object.keys(data).map(async (key) => {
        const region: RegionBase = regions.filter(
          (region) => region.name === key,
        )[0];
        if (region) {
          statesArray.push({
            id: region.id,
            key: key,
            point: region.point,
            enabled: data[key].enabled,
            enabled_at: data[key].enabled_at,
            disabled_at: data[key].disabled_at,
          });
        }
      });
    }
    return statesArray;
  }

  async getRegionsLibrary(): Promise<Array<RegionBase>> {
    return [
      { id: 1, name: 'Вінницька область', point: 80 },
      { id: 2, name: 'Волинська область', point: 80 },
      { id: 3, name: 'Дніпропетровська область', point: 10 },
      { id: 4, name: 'Донецька область', point: 0 },
      { id: 5, name: 'Житомирська область', point: 60 },
      { id: 6, name: 'Закарпатська область', point: 90 },
      { id: 7, name: 'Запорізька область', point: 5 },
      { id: 8, name: 'Івано-Франківська область', point: 100 },
      { id: 9, name: 'Київська область', point: 40 },
      { id: 10, name: 'Кіровоградська область', point: 25 },
      { id: 11, name: 'Луганська область', point: 0 },
      { id: 12, name: 'Львівська область', point: 90 },
      { id: 13, name: 'Миколаївська область', point: 40 },
      { id: 14, name: 'Одеська область', point: 45 },
      { id: 15, name: 'Полтавська область', point: 20 },
      { id: 16, name: 'Рівненська область', point: 60 },
      { id: 17, name: 'Сумська область', point: 5 },
      { id: 18, name: 'Тернопільська область', point: 90 },
      { id: 19, name: 'Харківська область', point: 5 },
      { id: 20, name: 'Херсонська область', point: 15 },
      { id: 21, name: 'Хмельницька область', point: 80 },
      { id: 22, name: 'Черкаська область', point: 25 },
      { id: 23, name: 'Чернівецька область', point: 90 },
      { id: 24, name: 'Чернігівська область', point: 25 },
    ];
  }
}
