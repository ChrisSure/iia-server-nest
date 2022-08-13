import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './services/task.service';
import { RegionService } from './services/region.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [TasksService, RegionService],
  exports: [RegionService],
})
export class AppModule {}
