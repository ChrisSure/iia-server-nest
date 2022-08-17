import { IsDate, IsNumber } from 'class-validator';

export class CreateUnitDto {
  @IsNumber()
  readonly point: number;

  @IsDate()
  readonly date: Date;
}
