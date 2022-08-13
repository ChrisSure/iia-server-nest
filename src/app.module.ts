import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './services/task.service';
import { ProcessService } from './services/process.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [TasksService, ProcessService],
  exports: [ProcessService],
})
export class AppModule {}
