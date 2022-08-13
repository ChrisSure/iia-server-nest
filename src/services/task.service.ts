import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProcessService } from './process.service';
import axios from 'axios';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private _processService: ProcessService;

  constructor(processService: ProcessService) {
    this._processService = processService;
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCronAlarm() {
    this._processService.getData().then((data) => console.log(data));
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleCronGarbage() {
    this.logger.debug('Garbage');
  }
}
