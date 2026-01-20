import { CreateUnitDto } from '../dtos/create-unit.dto';
import { Unit } from './unit.interface';

export interface UnitRepositoryPort {
  create(createUnitDto: CreateUnitDto): Promise<Unit>;
  findLast(): Promise<Unit | null>;
  findLastFromRecent(): Promise<Unit | null>;
  removeAllUnits(): Promise<void>;
}
