import { Controller, Get } from '@nestjs/common';

@Controller()
export class HomeController {
  @Get()
  getHello(): string {
    return 'Air Alarm Server Works!!!';
  }
}
