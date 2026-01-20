import { Injectable } from '@nestjs/common';
import { Region } from '../region/interfaces/region.interface';
import { Statistic } from '../statistic/interfaces/statistic.interface';
import {
  POINT_THRESHOLD_HIGH,
  POINT_ADJUSTED_HIGH,
  POINT_THRESHOLD_MEDIUM,
  POINT_ADJUSTED_MEDIUM,
  POINT_TIME_ADJUSTMENT_MAX_THRESHOLD,
  POINT_TIME_ADJUSTMENT_MIN_THRESHOLD,
  POINT_INCREMENT,
  STATISTICAL_DAY_OFFSET,
} from './constants/point-thresholds';
import {
  CRITICAL_HIGH_THREAT_REGIONS,
  KEY_MEDIUM_THREAT_REGIONS,
} from './constants/region-groups';

@Injectable()
export class PointBehaviourService {
  activeRegions: Array<Region>;

  async start(
    biggerPoint: number,
    regions: Array<Region>,
    currentDate: Date,
    statisticReport: Statistic,
  ): Promise<number> {
    this.activeRegions = await this.setActiveRegions(regions);
    biggerPoint = await this.towardsBehaviour(biggerPoint);
    biggerPoint = await this.timeBehaviour(
      biggerPoint,
      currentDate,
      statisticReport,
    );
    return biggerPoint;
  }

  async towardsBehaviour(biggerPoint: number): Promise<number> {
    const regionsKeys = await this.getRegionsKeys();
    let newPoint = biggerPoint;
    switch (biggerPoint) {
      case POINT_THRESHOLD_HIGH:
        newPoint = (await this.regionValueExist(
          CRITICAL_HIGH_THREAT_REGIONS,
          regionsKeys,
        ))
          ? POINT_ADJUSTED_HIGH
          : POINT_THRESHOLD_HIGH;
        break;
      case POINT_THRESHOLD_MEDIUM:
        newPoint = (await this.regionValueExist(
          KEY_MEDIUM_THREAT_REGIONS,
          regionsKeys,
        ))
          ? POINT_ADJUSTED_MEDIUM
          : POINT_THRESHOLD_MEDIUM;
        break;
    }
    return newPoint;
  }

  async timeBehaviour(
    biggerPoint: number,
    currentDate: Date,
    statisticReport: Statistic,
  ): Promise<number> {
    let newPoint = biggerPoint;
    const hour = currentDate.getUTCHours();
    const day = currentDate.getUTCDay();

    if (
      newPoint < POINT_TIME_ADJUSTMENT_MAX_THRESHOLD &&
      newPoint > POINT_TIME_ADJUSTMENT_MIN_THRESHOLD
    ) {
      if (day === statisticReport.maxDay + STATISTICAL_DAY_OFFSET) {
        newPoint = newPoint + POINT_INCREMENT;
      }

      if (
        hour === statisticReport.firstMaxHour ||
        hour === statisticReport.secondMaxHour
      ) {
        newPoint = newPoint + POINT_INCREMENT;
      }
    }

    return newPoint;
  }

  async setActiveRegions(regions: Array<Region>): Promise<Array<Region>> {
    const activeRegions = [];
    regions.forEach((region) => {
      if (region.enabled) {
        activeRegions.push(region);
      }
    });
    return activeRegions;
  }

  async getRegionsKeys(): Promise<Array<number>> {
    return this.activeRegions.map((region) => region.id);
  }

  async regionValueExist(
    regionsArray: Array<number>,
    regionsKeys: Array<number>,
  ): Promise<boolean> {
    const result = regionsArray.filter((region) =>
      regionsKeys.includes(region),
    );
    return result.length >= regionsArray.length;
  }
}
