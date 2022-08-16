import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Unit, UnitDocument } from '../../schemas/unit.schema';
import { CreateUnitDto } from '../../interfaces/unit/create-unit.dto';

@Injectable()
export class UnitService {
  constructor(@InjectModel(Unit.name) private unitModel: Model<UnitDocument>) {}

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const createdUnit = new this.unitModel(createUnitDto);
    return createdUnit.save();
  }

  async findLast(): Promise<Unit> {
    const lastUnit = await this.unitModel.find({}).sort({ _id: -1 }).limit(1);
    return lastUnit[0];
  }
}
