import { AlarmService } from '../alarm.service';

describe('AlarmService', () => {
  const service: AlarmService = new AlarmService();
  it('isAlarmGone true', async () => {
    const alarmDate: Date = new Date(new Date().getTime() - (1800000 + 100000));
    const response: boolean = await service.isAlarmGone(alarmDate);
    expect(response).toBeTruthy();
  });

  it('isAlarmGone false', async () => {
    const alarmDate: Date = new Date(new Date().getTime() - (1800000 - 100000));
    const response: boolean = await service.isAlarmGone(alarmDate);
    expect(response).not.toBeTruthy();
  });
});
