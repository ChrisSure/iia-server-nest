import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Alarm, AlarmDocument } from '../schemas/alarm.schema';
import { CreateAlarmDto } from '../dtos/create-alarm.dto';
import { AlarmRepositoryPort } from '../interface/alarm-repository.interface';
import { AlarmRecord } from '../interface/alarm.interface';

@Injectable()
export class MongoAlarmRepository implements AlarmRepositoryPort {
  constructor(
    @InjectModel(Alarm.name) private alarmModel: Model<AlarmDocument>,
  ) {}

  async create(createAlarmDto: CreateAlarmDto): Promise<AlarmRecord> {
    const createdAlarm = new this.alarmModel(createAlarmDto);
    return createdAlarm.save();
  }

  async findLast(): Promise<AlarmRecord | null> {
    const lastAlarm = await this.alarmModel.find({}).sort({ _id: -1 }).limit(1);
    return lastAlarm.length > 0 ? lastAlarm[0] : null;
  }

  async getAll(): Promise<AlarmRecord[]> {
    return await this.alarmModel.find({}).exec();
  }
}
