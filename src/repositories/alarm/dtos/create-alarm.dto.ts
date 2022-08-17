import { IsDate } from 'class-validator';

export class CreateAlarmDto {
  @IsDate()
  readonly date: Date;
}
