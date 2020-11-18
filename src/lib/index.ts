import * as Types from '../types';
import jwt from 'jsonwebtoken';

const { LINK_EXPIRE, JWT_SECRET }: any = process.env;

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


export const CampaignStatuses: Types.CampaignStatus[] = ['active', 'pause', 'pending', 'budget'];
