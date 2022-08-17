import { Injectable } from '@nestjs/common';
import { Region } from '../region/interfaces/region.interface';

@Injectable()
export class PointBehaviourService {
  activeRegions: Array<Region>;

  async start(
    biggerPoint: number,
    regions: Array<Region>,
    currentDate: Date,
  ): Promise<number> {
    this.activeRegions = await this.setActiveRegions(regions);
    biggerPoint = await this.towardsBehaviour(biggerPoint);
    biggerPoint = await this.timeBehaviour(biggerPoint, currentDate);
    return biggerPoint;
  }

  async towardsBehaviour(biggerPoint: number): Promise<number> {
    const regionsKeys = await this.getRegionsKeys();
    let newPoint = biggerPoint;
    switch (biggerPoint) {
      case 50:
        newPoint = (await this.regionValueExist([13, 14, 1], regionsKeys))
          ? 60
          : 50;
        break;
      case 65:
        newPoint = (await this.regionValueExist([13, 14, 1, 21], regionsKeys))
          ? 75
          : 65;
        break;
      case 80:
        newPoint = (await this.regionValueExist([2, 5, 16], regionsKeys))
          ? 75
          : 80;
        break;
    }
    return newPoint;
  }

  async timeBehaviour(biggerPoint: number, currentDate: Date): Promise<number> {
    let newPoint = biggerPoint;
    const hour = currentDate.getHours();
    const day = currentDate.getDay();

    if (newPoint < 80 && newPoint > 4) {
      if (day === 2) {
        newPoint = newPoint + 5;
      }

      if (hour === 11 || hour === 20) {
        newPoint = newPoint + 5;
      }

      if (hour === 0 || hour === 14) {
        newPoint = newPoint - 5;
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
