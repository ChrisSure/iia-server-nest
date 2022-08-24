import { MessengerService } from '../messenger.service';

describe('MessengerService', () => {
  const service: MessengerService = new MessengerService();
  it('getNotificationLevel low', async () => {
    const response: string = await service.getNotificationLevel(20, 50);
    expect(response).toEqual('low');
  });
  it('getNotificationLevel average', async () => {
    const response: string = await service.getNotificationLevel(60, 20);
    expect(response).toEqual('average');
  });
  it('getNotificationLevel high', async () => {
    const response: string = await service.getNotificationLevel(90, 60);
    expect(response).toEqual('high');
  });
  it('getNotificationLevel rebound', async () => {
    const response: string = await service.getNotificationLevel(90, 100);
    expect(response).toEqual('rebound');
  });
  it('getNotificationLevel alarm', async () => {
    const response: string = await service.getNotificationLevel(100, 50);
    expect(response).toEqual('alarm');
  });
  it('getNotificationLevel empty', async () => {
    const response: string = await service.getNotificationLevel(20, 30);
    expect(response).toEqual('');
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

  it('getConnectionLink stage', async () => {
    process.env.ENV = 'stage';
    const message = '🙏 Увага Оголошена Повітряна Тривога 🙏';
    const testMessage = encodeURI(
      `https://api.telegram.org/bot5504688883:AAH1yOYmG8fxn_vYD3ZJFQn1LWF75m2NI_Y/sendMessage?chat_id=-1001615018661&text=${message}`,
    );
    const response: string = await service.getConnectionLink(message);
    expect(response).toEqual(testMessage);
  });
});
