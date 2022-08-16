import { Injectable } from '@nestjs/common';
import { Alarm, AlarmDocument } from '../../schemas/alarm.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAlarmDto } from '../../interfaces/alarm/create-alarm.dto';

@Injectable()
export class AlarmService {
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

  async isAlarmGone(date): Promise<boolean> {
    const halfAnHour = 1800000;
    return new Date().getTime() - date.getTime() > halfAnHour;
  }
}
