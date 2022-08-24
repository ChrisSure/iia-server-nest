import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Unit, UnitDocument } from './schemas/unit.schema';
import { CreateUnitDto } from './dtos/create-unit.dto';

@Injectable()
export class UnitRepository {
  constructor(@InjectModel(Unit.name) private unitModel: Model<UnitDocument>) {}

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const createdUnit = new this.unitModel(createUnitDto);
    return createdUnit.save();
  }

  async findLast(): Promise<Unit> {
    const lastUnit = await this.unitModel.find({}).sort({ _id: -1 }).limit(1);
    return lastUnit[0];
  }

  async removeAllUnits(): Promise<void> {
    const currentTime = new Date().getTime() - 300000;
    await this.unitModel.deleteMany({ date: { $lt: currentTime } });
  }
}
