import { Injectable } from '@nestjs/common';
import { Region } from '../region/interfaces/region.interface';
import { Statistic } from '../statistic/interfaces/statistic.interface';

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
      case 80:
        newPoint = (await this.regionValueExist([1, 13, 14], regionsKeys))
          ? 85
          : 80;
        break;
      case 40:
        newPoint = (await this.regionValueExist([9, 10, 15, 22], regionsKeys))
          ? 50
          : 40;
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

    if (newPoint < 80 && newPoint > 4) {
      if (day === statisticReport.maxDay + 1) {
        newPoint = newPoint + 5;
      }

      if (
        hour === statisticReport.firstMaxHour ||
        hour === statisticReport.secondMaxHour
      ) {
        newPoint = newPoint + 5;
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
