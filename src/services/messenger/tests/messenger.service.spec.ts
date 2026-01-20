import { MessengerService } from '../messenger.service';
import { NotificationLevel } from '../enums/notification-level.enum';
import { unitMock } from './mock/unit.mock';

describe('MessengerService', () => {
  const service: MessengerService = new MessengerService();
  const unitMockObj = unitMock();
  it('getNotificationLevel low', async () => {
    const response: string = await service.getNotificationLevel(20, 50, false);
    expect(response).toEqual(NotificationLevel.LOW);
  });
  it('getNotificationLevel average', async () => {
    const response: string = await service.getNotificationLevel(60, 20, false);
    expect(response).toEqual(NotificationLevel.AVERAGE);
  });
  it('getNotificationLevel high', async () => {
    const response: string = await service.getNotificationLevel(90, 60, false);
    expect(response).toEqual(NotificationLevel.HIGH);
  });
  it('getNotificationLevel rebound', async () => {
    const response: string = await service.getNotificationLevel(90, 100, false);
    expect(response).toEqual(NotificationLevel.REBOUND);
  });
  it('getNotificationLevel alarm', async () => {
    const response: string = await service.getNotificationLevel(100, 50, false);
    expect(response).toEqual(NotificationLevel.ALARM);
  });
  it('getNotificationLevel empty', async () => {
    const response: string = await service.getNotificationLevel(20, 30, false);
    expect(response).toEqual(NotificationLevel.NONE);
  });
  it('getNotificationLevel alarm without fast alarm option', async () => {
    const response: string = await service.getNotificationLevel(100, 30, false);
    expect(response).toEqual(NotificationLevel.ALARM);
  });
  it('getNotificationLevel alarm with fast alarm option', async () => {
    const response: string = await service.getNotificationLevel(100, 30, true);
    expect(response).toEqual(NotificationLevel.ALARM_FAST);
  });

  it('generateMessage low', async () => {
    const result = 50;
    const response: string = await service.generateMessage(
      NotificationLevel.LOW,
      result,
    );
    expect(response).toEqual(
      `Імовірність Повітряної Тривоги - НИЗЬКА(${result}%)`,
    );
  });
  it('generateMessage average', async () => {
    const result = 50;
    const response: string = await service.generateMessage(
      NotificationLevel.AVERAGE,
      result,
    );
    expect(response).toEqual(
      `Імовірність Повітряної Тривоги - СЕРЕДНЯ(${result}%)`,
    );
  });
  it('generateMessage high', async () => {
    const result = 50;
    const response: string = await service.generateMessage(
      NotificationLevel.HIGH,
      result,
    );
    expect(response).toEqual(
      `Імовірність Повітряної Тривоги - ВИСОКА(${result}%)`,
    );
  });
  it('generateMessage rebound', async () => {
    const result = 50;
    const response: string = await service.generateMessage(
      NotificationLevel.REBOUND,
      result,
    );
    expect(response).toEqual('🇺🇦 Відбій повітряної тривоги 🇺🇦');
  });
  it('generateMessage alarm', async () => {
    const result = 50;
    const response: string = await service.generateMessage(
      NotificationLevel.ALARM,
      result,
    );
    expect(response).toEqual('🙏 Увага Оголошена Повітряна Тривога 🙏');
  });
  it('generateMessage alarm-fast', async () => {
    const result = 50;
    const response: string = await service.generateMessage(
      NotificationLevel.ALARM_FAST,
      result,
    );
    expect(response).toEqual(
      '🛫 Повітряна тривога спровокована злетом носія ракети кинжал 🛫',
    );
  });

  it('getConnectionLink stage', async () => {
    process.env.ENV = 'stage';
    const message = '🙏 Увага Оголошена Повітряна Тривога 🙏';
    const testMessage = encodeURI(
      `https://api.telegram.org/bot5504688883:AAH1yOYmG8fxn_vYD3ZJFQn1LWF75m2NI_Y/sendMessage?chat_id=-1001615018661&text=${message}`,
    );
    const response: string = await service.getConnectionLink(message);
    expect(response).toEqual(testMessage);
  });

  it('isFastAlarm false', async () => {
    const result = 50;
    const response: boolean = await service.isFastAlarm(result, unitMockObj);
    expect(response).toEqual(false);
  });

  it('isFastAlarm false point bigger', async () => {
    const result = 100;
    const response: boolean = await service.isFastAlarm(result, unitMockObj);
    expect(response).toEqual(false);
  });

  it('isFastAlarm true', async () => {
    const result = 100;
    const unitMockNew = unitMockObj;
    unitMockNew.point = 20;
    const response: boolean = await service.isFastAlarm(result, unitMockNew);
    expect(response).toEqual(true);
  });
});
