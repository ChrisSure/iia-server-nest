import { NotificationLevel } from '../enums/notification-level.enum';

export const PERCENTAGE_SYMBOL = '%';

export const NOTIFICATION_MESSAGES: Record<NotificationLevel, string> = {
  [NotificationLevel.LOW]: 'Імовірність Повітряної Тривоги - НИЗЬКА',
  [NotificationLevel.AVERAGE]: 'Імовірність Повітряної Тривоги - СЕРЕДНЯ',
  [NotificationLevel.HIGH]: 'Імовірність Повітряної Тривоги - ВИСОКА',
  [NotificationLevel.REBOUND]: '🇺🇦 Відбій повітряної тривоги 🇺🇦',
  [NotificationLevel.ALARM]: '🙏 Увага Оголошена Повітряна Тривога 🙏',
  [NotificationLevel.ALARM_FAST]:
    '🛫 Повітряна тривога спровокована злетом носія ракети кинжал 🛫',
  [NotificationLevel.NONE]: '',
};
