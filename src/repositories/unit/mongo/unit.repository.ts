import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Unit, UnitDocument } from '../schemas/unit.schema';
import { CreateUnitDto } from '../dtos/create-unit.dto';
import { UnitRepositoryPort } from '../interface/unit-repository.interface';
import { Unit as UnitRecord } from '../interface/unit.interface';

@Injectable()
export class MongoUnitRepository implements UnitRepositoryPort {
  constructor(@InjectModel(Unit.name) private unitModel: Model<UnitDocument>) {}

  async create(createUnitDto: CreateUnitDto): Promise<UnitRecord> {
    const createdUnit = new this.unitModel(createUnitDto);
    return createdUnit.save();
  }

  async findLast(): Promise<UnitRecord | null> {
    const lastUnit = await this.unitModel.find({}).sort({ _id: -1 }).limit(1);
    return lastUnit.length > 0 ? lastUnit[0] : null;
  }

  async findLastFromRecent(): Promise<UnitRecord | null> {
    const lastFive = await this.unitModel
      .find()
      .sort({ _id: -1 })
      .limit(15)
      .exec();
    return lastFive.length > 0 ? lastFive[lastFive.length - 1] : null;
  }

  async removeAllUnits(): Promise<void> {
    const currentTime = new Date().getTime() - 300000;
    await this.unitModel.deleteMany({ date: { $lt: currentTime } });
  }
}
