import { RegionBase } from './region-base.interface';

export interface Region extends RegionBase {
  id: number;
  point: number;
}
