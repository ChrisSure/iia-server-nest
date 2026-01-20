import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { CreateUnitDto } from '../dtos/create-unit.dto';
import { UnitEntity } from '../entities/unit.entity';
import { UnitRepositoryPort } from '../interface/unit-repository.interface';
import { Unit as UnitRecord } from '../interface/unit.interface';

@Injectable()
export class MysqlUnitRepository implements UnitRepositoryPort {
  constructor(
    @InjectRepository(UnitEntity)
    private readonly unitRepository: Repository<UnitEntity>,
  ) {}

  async create(createUnitDto: CreateUnitDto): Promise<UnitRecord> {
    const createdUnit = this.unitRepository.create(createUnitDto);
    return this.unitRepository.save(createdUnit);
  }

  async findLast(): Promise<UnitRecord | null> {
    const lastUnit = await this.unitRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    return lastUnit.length > 0 ? lastUnit[0] : null;
  }

  async findLastFromRecent(): Promise<UnitRecord | null> {
    const lastFifteen = await this.unitRepository.find({
      order: { id: 'DESC' },
      take: 15,
    });
    return lastFifteen.length > 0 ? lastFifteen[lastFifteen.length - 1] : null;
  }

  async removeAllUnits(): Promise<void> {
    const currentTime = new Date(Date.now() - 300000);
    await this.unitRepository.delete({ date: LessThan(currentTime) });
  }
}
