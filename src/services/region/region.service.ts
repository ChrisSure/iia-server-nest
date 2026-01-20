import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RegionBase } from './interfaces/region-base.interface';
import { Region } from './interfaces/region.interface';
import { API_LINK } from '../../constants/global';
import { REGIONS_LIBRARY } from './constants/regions-library';

@Injectable()
export class RegionService {
  async getRegions(): Promise<Array<Region>> {
    return axios
      .get(API_LINK)
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
    return REGIONS_LIBRARY;
  }
}
