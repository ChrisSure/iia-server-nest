import { MessengerService } from '../messenger.service';
import { unitMock } from './mock/unit.mock';

describe('MessengerService', () => {
  const service: MessengerService = new MessengerService();
  const unitMockObj = unitMock();
  it('getNotificationLevel low', async () => {
    const response: string = await service.getNotificationLevel(20, 50, false);
    expect(response).toEqual('low');
  });
  it('getNotificationLevel average', async () => {
    const response: string = await service.getNotificationLevel(60, 20, false);
    expect(response).toEqual('average');
  });
  it('getNotificationLevel high', async () => {
    const response: string = await service.getNotificationLevel(90, 60, false);
    expect(response).toEqual('high');
  });
  it('getNotificationLevel rebound', async () => {
    const response: string = await service.getNotificationLevel(90, 100, false);
    expect(response).toEqual('rebound');
  });
  it('getNotificationLevel alarm', async () => {
    const response: string = await service.getNotificationLevel(100, 50, false);
    expect(response).toEqual('alarm');
  });
  it('getNotificationLevel empty', async () => {
    const response: string = await service.getNotificationLevel(20, 30, false);
    expect(response).toEqual('');
  });
  it('getNotificationLevel alarm without fast alarm option', async () => {
    const response: string = await service.getNotificationLevel(100, 30, false);
    expect(response).toEqual('alarm');
  });
  it('getNotificationLevel alarm with fast alarm option', async () => {
    const response: string = await service.getNotificationLevel(100, 30, true);
    expect(response).toEqual('alarm-fast');
  });

  it('generateMessage low', async () => {
    const result = 50;
    const response: string = await service.generateMessage('low', result);
    expect(response).toEqual(
      `Імовірність Повітряної Тривоги - НИЗЬКА(${result}%)`,
    );
  });
  it('generateMessage average', async () => {
    const result = 50;
    const response: string = await service.generateMessage('average', result);
    expect(response).toEqual(
      `Імовірність Повітряної Тривоги - СЕРЕДНЯ(${result}%)`,
    );
  });
  it('generateMessage high', async () => {
    const result = 50;
    const response: string = await service.generateMessage('high', result);
    expect(response).toEqual(
      `Імовірність Повітряної Тривоги - ВИСОКА(${result}%)`,
    );
  });
  it('generateMessage rebound', async () => {
    const result = 50;
    const response: string = await service.generateMessage('rebound', result);
    expect(response).toEqual('🇺🇦 Відбій повітряної тривоги 🇺🇦');
  });
  it('generateMessage alarm', async () => {
    const result = 50;
    const response: string = await service.generateMessage('alarm', result);
    expect(response).toEqual('🙏 Увага Оголошена Повітряна Тривога 🙏');
  });
  it('generateMessage alarm-fast', async () => {
    const result = 50;
    const response: string = await service.generateMessage(
      'alarm-fast',
      result,
    );
    expect(response).toEqual(
      '🛫 Повітряна тривога спровокована злетом носія ракети кинжал, ризики для Івано-Франківська мінімальні 🛫',
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
    const lastResult = 30;
    const currentDate = Date.now();
    const response: boolean = await service.isFastAlarm(
      result,
      lastResult,
      unitMockObj,
      currentDate,
    );
    expect(response).toEqual(false);
  });

  it('isFastAlarm false date bigger', async () => {
    const result = 50;
    const lastResult = 30;
    const currentDate = Date.now();
    const unitMockNew = unitMockObj;
    unitMockNew.date = new Date(Date.now() - 130000);
    const response: boolean = await service.isFastAlarm(
      result,
      lastResult,
      unitMockNew,
      currentDate,
    );
    expect(response).toEqual(false);
  });

  it('isFastAlarm true', async () => {
    const result = 50;
    const lastResult = 30;
    const currentDate = Date.now();
    const unitMockNew = unitMockObj;
    unitMockNew.date = new Date(Date.now() - 90000);
    const response: boolean = await service.isFastAlarm(
      result,
      lastResult,
      unitMockNew,
      currentDate,
    );
    expect(response).toEqual(false);
  });
});
