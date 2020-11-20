/* eslint-disable no-case-declarations */
/**
 * Здесь методы делающе операции, которые просто возвращают нужные данные,
 * но не делают изменений ни на дистке ни в облаке.
 */

import * as Types from '../types';
import { FieldPacket, QueryError } from 'mysql2';
import connection from '../orm/connection';
import jwt from 'jsonwebtoken';

const { LINK_EXPIRE, JWT_SECRET }: any = process.env;

/**
 * Обработка запроса к базе данных
 * @param sql - запрос возможно с ?
 * @param values - массив значений
 * @param errMessage - сообщение об ошибке для лога и ответа
 */
export function runDBQuery(sql: string, errMessage: string, values: any = []): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(sql, values, (err: QueryError | null, result: any, fields: FieldPacket[]) => {
      if (err) {
        console.error(`<${Date()}>`, `[${errMessage}]`, err);
        resolve({
          error: 1,
          message: errMessage,
          data: err.message,
        });
      } else {
        resolve({
          error: 0,
          data: result,
          message: 'Success request to database',
        });
      }
    });
  });
}


/**
 *  Проверяет соответствует ли строка регулярному выражению для email
 * 
 * @param email {string}
 */

export function checkEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z\-]+\.)+[A-Za-z]{2,}))$/;
  if (re.exec(email)) {
    return true;
  }
  return false;
}

/**
 *  Кодирует строку в base64
 *  
 * @param data {string}
 */
export function encodeBase64(data: string): string {
  return Buffer.from(data).toString('base64');
}

/**
 * Декодирует строку из base64
 * @param data 
 */
export function decodeBase64(data: string): string {
  const buff = Buffer.alloc(data.length, data, 'base64');
  return buff.toString('ascii');
}

/**
 *  Проверяет не прошло ли времени больше чем указано в .env LINK_EXPIRE
 * от последнего изменения пользователя.
 * 
 * @param updated 
 */
export function checkDateExpire(updated: number): boolean {
  return Date.now() - updated > parseInt(LINK_EXPIRE ,10) * 3600 * 24 * 1000;
}

/**
 *  Проверяет соответствует ли ключ, последнему времени изменения updated - пользователя
 * @param updated 
 * @param key 
 */
export function checkKey(updated: string, key: string): boolean {
  return encodeBase64(updated).trim() === key.trim();
}

/**
 *  Возвращает токен созданый из id пользователя, почты, userAgent и шифрованного пароля
 *  
 * @param email 
 * @param userAgent 
 * @param password 
 */
export function createToken(id: number, admin: number, email: string, userAgent: string, password: string): string {
  return jwt.sign({
    id,
    admin,
    email,
    userAgent,
    password,
  }, JWT_SECRET);
}

/**
 *  Парсит JWT токен который должен содержать id пользователя, почту, userAgent и шифрованный пароль
 * @param token 
 */
export function parseToken(token: string): Types.JWT {
  let parsedToken: Types.JWT;
  try {
    // @ts-ignore
    parsedToken = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    parsedToken = {
      id: -1,
      admin: 0,
      email: '',
      userAgent: '',
      password: '',
    };
  }
  return parsedToken;
}

/**
 * Возвращает дату начала сегодняшнего дня
 */
export function getTodayTimeStart(): Date {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setUTCMilliseconds(0);
  return date;
}

/**
 * Возможные варианты временного отрезка
 */
export const TimeShiftVariants: Types.Time[] = [
  'today', 'yesterday', 'last-3-days', 'last-7-days', 'this-month',
  'last-30-days', 'last-month', 'this-quarter', 'this-year', 'last-year', 'custom',
];

/**
 * высчитывает дату по вариантам временного отрезка
 * @param shift 
 * @param customDays 
 */
export function calculateDate(shift: Types.Time, customDays: Date[] | undefined): Types.TimeCalculator {
  const date = getTodayTimeStart();
  let range = 'TIME(h.date)';
  // Для шаблонов считает дату и интервал группировки для графика
  switch (shift) {
    case 'yesterday':
      range = 'TIME(h.date)';
      date.setDate(date.getDate() - 1);
      break;
    case 'last-3-days':
      range = 'DAY(h.date)';
      date.setDate(date.getDate() - 3);
      break;
    case 'last-7-days':
      range = 'DAY(h.date)';
      date.setDate(date.getDate() - 7);
      break;
    case 'this-month':
      range = 'DAY(h.date)';
      date.setDate(1);
      break;
    case 'last-30-days':
      range = 'WEEK(h.date)';
      date.setDate(date.getDate() - 30);
      break;
    case 'last-month':
      range = 'WEEK(h.date)';
      date.setMonth(date.getMonth() - 1);
      date.setDate(1);
      break;
    case 'this-quarter':
      range = 'MONTH(h.date)';
      date.setMonth(date.getMonth() - 3);
      break;
    case 'this-year':
      range = 'QUARTER(h.date)';
      date.setMonth(1);
      date.setDate(1);
      break;
    case 'last-year':
      range = 'QUARTER(h.date)';
      date.setFullYear(date.getFullYear() - 1);
      break;
  }
  // Для пользовательского интервала дат считает только интервал группировки. Это только для графика.
  if (shift === 'custom') {
    // @ts-ignore 
    const days = Math.floor((customDays[1].getTime() - customDays[0].getTime()) / 86400000);
    if (days <= 3) {
      range = 'TIME(h.date)';
    } else if (days <= 30) {
      range = 'DAY(h.date)';
    } else if (days <= 90) {
      range = 'WEEK(h.date)';
    } else if (days <= 360) {
      range = 'MONTH(h.date)';
    } else {
      range = 'MONTH(h.date)';
    }
  }
  return {
    time: date,
    range,
  };
}

/**
 * Возможные варианты статуса кампании
 */
export const CampaignStatuses: Types.CampaignStatus[] = ['active', 'pause', 'pending', 'budget'];

/**
 *  Возможные варианты группировки статистики 
 */
export const GroupByVariants: Types.GroupBy[] = ['date', 'user', 'campaign', 'subid', 'country'];


/**
 * Возможные варианты сортировки статистики 
 */
export const OrderByVariants: Types.OrderByVariants[] = ['id', 'date', 'campaign', 'subid', 'country', 'requests', 'impressions', 'clicks', 'cost'];

export const TransactionFilterVariants: Types.TransactionFilter[] = ['date', 'user'];
