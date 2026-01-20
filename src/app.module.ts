import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TasksService } from './services/task/task.service';
import { RegionService } from './services/region/region.service';
import { PointBehaviourService } from './services/point-behaviour/point-behaviour.service';
import { AlarmService } from './services/alarm/alarm.service';
import { Alarm, AlarmSchema } from './repositories/alarm/schemas/alarm.schema';
import { Unit, UnitSchema } from './repositories/unit/schemas/unit.schema';
import { MongoAlarmRepository } from './repositories/alarm/mongo/alarm.repository';
import { MongoUnitRepository } from './repositories/unit/mongo/unit.repository';
import { MysqlAlarmRepository } from './repositories/alarm/mysql/alarm.repository';
import { MysqlUnitRepository } from './repositories/unit/mysql/unit.repository';
import { AlarmEntity } from './repositories/alarm/entities/alarm.entity';
import { UnitEntity } from './repositories/unit/entities/unit.entity';
import { MessengerService } from './services/messenger/messenger.service';
import { HomeController } from './controllers/home.controller';
import { StatisticService } from './services/statistic/statistic.service';
import { MONGO_CONNECTION } from './constants/global';
import {
  ALARM_REPOSITORY,
  UNIT_REPOSITORY,
} from './repositories/repository.tokens';

const dbProvider =
  process.env.DB_PROVIDER?.toLowerCase() === 'mongo' ? 'mongo' : 'mysql';
const isMysql = dbProvider === 'mysql';

const alarmRepositoryProvider = {
  provide: ALARM_REPOSITORY,
  useClass: isMysql ? MysqlAlarmRepository : MongoAlarmRepository,
};

const unitRepositoryProvider = {
  provide: UNIT_REPOSITORY,
  useClass: isMysql ? MysqlUnitRepository : MongoUnitRepository,
};

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    ...(isMysql
      ? [
          TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT ?? 3306),
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            entities: [AlarmEntity, UnitEntity],
            synchronize: process.env.TYPEORM_SYNC === 'true',
          }),
          TypeOrmModule.forFeature([AlarmEntity, UnitEntity]),
        ]
      : [
          MongooseModule.forRoot(
            process.env.MONGO_CONNECTION ?? MONGO_CONNECTION,
          ),
          MongooseModule.forFeature([
            { name: Alarm.name, schema: AlarmSchema },
            { name: Unit.name, schema: UnitSchema },
          ]),
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
    alarmRepositoryProvider,
    unitRepositoryProvider,
  ],
})
export class AppModule {}
