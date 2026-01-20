import { CreateAlarmDto } from '../dtos/create-alarm.dto';
import { AlarmRecord } from './alarm.interface';

export interface AlarmRepositoryPort {
  create(createAlarmDto: CreateAlarmDto): Promise<AlarmRecord>;
  findLast(): Promise<AlarmRecord | null>;
  getAll(): Promise<AlarmRecord[]>;
}
