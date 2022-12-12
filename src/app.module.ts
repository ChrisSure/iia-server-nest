import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './services/task/task.service';
import { RegionService } from './services/region/region.service';
import { PointBehaviourService } from './services/point-behaviour/point-behaviour.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AlarmService } from './services/alarm/alarm.service';
import { Alarm, AlarmSchema } from './repositories/alarm/schemas/alarm.schema';
import { Unit, UnitSchema } from './repositories/unit/schemas/unit.schema';
import { AlarmRepository } from './repositories/alarm/alarm.repository';
import { UnitRepository } from './repositories/unit/unit.repository';
import { MessengerService } from './services/messenger/messenger.service';
import { HomeController } from './controllers/home.controller';
import { StatisticService } from './services/statistic/statistic.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://Mbappe9119:AXmgL5D6hdATYtM@ifairalarmdev.19uvw.mongodb.net/?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: Alarm.name, schema: AlarmSchema },
      { name: Unit.name, schema: UnitSchema },
    ]),
  ],
  controllers: [HomeController],
  providers: [
    TasksService,
    RegionService,
    PointBehaviourService,
    AlarmService,
    MessengerService,
    StatisticService,
    AlarmRepository,
    UnitRepository,
  ],
})
export class AppModule {}
