import { Injectable } from '@nestjs/common';
import { Alarm, AlarmDocument } from './schemas/alarm.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAlarmDto } from './dtos/create-alarm.dto';

@Injectable()
export class AlarmRepository {
  constructor(
    @InjectModel(Alarm.name) private alarmModel: Model<AlarmDocument>,
  ) {}

  async create(createAlarmDto: CreateAlarmDto): Promise<Alarm> {
    const createdAlarm = new this.alarmModel(createAlarmDto);
    return createdAlarm.save();
  }

  async findLast(): Promise<Alarm> {
    const lastAlarm = await this.alarmModel.find({}).sort({ _id: -1 }).limit(1);
    return lastAlarm[0];
  }
}
