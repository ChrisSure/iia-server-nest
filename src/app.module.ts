import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './services/task/task.service';
import { RegionService } from './services/region/region.service';
import { PointBehaviourService } from './services/point-behaviour/point-behaviour.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [TasksService, RegionService, PointBehaviourService],
})
export class AppModule {}
