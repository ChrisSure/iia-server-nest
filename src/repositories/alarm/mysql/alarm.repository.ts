import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlarmDto } from '../dtos/create-alarm.dto';
import { AlarmEntity } from '../entities/alarm.entity';
import { AlarmRepositoryPort } from '../interface/alarm-repository.interface';
import { AlarmRecord } from '../interface/alarm.interface';

@Injectable()
export class MysqlAlarmRepository implements AlarmRepositoryPort {
  constructor(
    @InjectRepository(AlarmEntity)
    private readonly alarmRepository: Repository<AlarmEntity>,
  ) {}

  async create(createAlarmDto: CreateAlarmDto): Promise<AlarmRecord> {
    const createdAlarm = this.alarmRepository.create(createAlarmDto);
    return this.alarmRepository.save(createdAlarm);
  }

  async findLast(): Promise<AlarmRecord | null> {
    const lastAlarm = await this.alarmRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    return lastAlarm.length > 0 ? lastAlarm[0] : null;
  }

  async getAll(): Promise<AlarmRecord[]> {
    return this.alarmRepository.find();
  }
}
