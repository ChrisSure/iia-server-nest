import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RegionBase } from '../interfaces/region-base.interface';

@Injectable()
export class ProcessService {
  async getData(): Promise<any[] | void> {
    return axios
      .get('https://emapa.fra1.cdn.digitaloceanspaces.com/statuses.json')
      .then(async (response) => {
        return await this.transformData(response.data.states);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async transformData(data): Promise<Array<RegionBase>> {
    const statesArray = [];
    if (data) {
      Object.keys(data).map((key) => {
        statesArray.push({
          key: key,
          enabled: data[key].enabled,
          enabled_at: data[key].enabled_at,
          disabled_at: data[key].disabled_at,
        });
      });
    }
    return statesArray;
  }
}
