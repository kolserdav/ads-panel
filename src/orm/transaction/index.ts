/**
 * Файл запросов к базе по транзакциям
 */

import * as Types from '../../types';
import * as lib from '../../lib';


const { MAX_DB_ID }: any = process.env;

/**
 * Создание транзакции
 * @param user_id 
 * @param amount 
 * @param comment 
 */
export function createTransaction(user_id: number, amount: number, comment: string): Promise<Types.OrmResult> {
  const query = 'INSERT INTO transactions (date, amount, user_id, comment) VALUES (?,?,?,?)';
  const values = [
    new Date(),
    amount,
    user_id,
    comment,
  ];
  return lib.runDBQuery(query, 'Error while create transaction', values);
}

/**
 * получает все транзакции по фильтрам
 * @param filter {date|user}
 * @param value {Date|number}
 * @param start {number}
 * @param count {number}
 * @param userId {number}
 */
export function getTransactions(filter: string, value: Date | number, start: number, count: number, userId: number): Promise<Types.OrmResult> {
  // Вычислят начальный и конечный номер результата
  const first = start ? start : 0;
  const all = count ? count : parseInt(MAX_DB_ID, 10);
  // Задаёт начальные значения
  const values: any = [first, all];
  let andUser = '';
  // Если обычный пользователь или админ self=1
  if (userId !== -1) {
    andUser = ' AND t.user_id=?';
    values.unshift(userId);
  }
  let where = '';
  // В зависимости от фильтра назначает запрос и значения к нему
  switch (filter) {
    case 'user':
      where = userId === -1 ? 'WHERE t.user_id=?' : '';
      // @ts-ignore
      if (userId !== -1) {
        values.shift();
      }
      values.unshift(value);
      break;
    case 'date':
      where = `WHERE t.date>=? AND t.date<=?${andUser}`;
      // eslint-disable-next-line no-case-declarations
      const firstDate = new Date(value);
      // eslint-disable-next-line no-case-declarations
      const lastDate = new Date(value);
      firstDate.setUTCHours(0);
      firstDate.setMinutes(0);
      firstDate.setSeconds(0);
      firstDate.setMilliseconds(1);
      lastDate.setUTCHours(23);
      lastDate.setUTCMinutes(59);
      lastDate.setSeconds(59);
      lastDate.setMilliseconds(999);
      values.unshift(lastDate);
      values.unshift(firstDate);
      break;
    default:
      where = userId === -1 ? '' : 'WHERE t.user_id=?';
      values.shift();
  }
  const query = `SELECT t.date,\
    u.first_name,\
    u.last_name,\
    t.user_id,\
    t.amount,\
    t.comment\
    FROM transactions t LEFT JOIN users u ON t.user_id=u.id ${where} LIMIT ?,?`;
  return lib.runDBQuery(query, 'Error while getting transactions', values);
}
