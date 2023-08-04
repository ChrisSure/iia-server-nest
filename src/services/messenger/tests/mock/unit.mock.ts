import { Unit } from '../../../../repositories/unit/interface/unit.interface';

export function unitMock(): Unit {
  const unitDate = new Date();
  return { point: 50, date: unitDate };
}
