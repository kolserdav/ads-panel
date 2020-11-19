/**
 * Файл запросов к базе по транзакциям
 */

import * as Types from '../../types';
import * as lib from '../../lib';

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


export function getTransactions(filter: string, value: Date | number): Promise<Types.OrmResult> {
  let where = filter === 'user' ? 'WHERE t.user_id=?' : 'WHERE t.date>=? AND t.date<=?';
  let values = [value];
  if (!value) {
    where = '';
    values = [];
  } else if (filter === 'date') {
    const firstDate = new Date(value);
    const lastDate = new Date(value);
    firstDate.setUTCHours(0);
    firstDate.setMinutes(0);
    firstDate.setSeconds(0);
    firstDate.setMilliseconds(1);
    lastDate.setUTCHours(23);
    lastDate.setUTCMinutes(59);
    lastDate.setSeconds(59);
    lastDate.setMilliseconds(999);
    console.log(firstDate);
    console.log(lastDate);
    values = [firstDate, lastDate];
  }
  const query = `SELECT t.date,\
    u.first_name,\
    u.last_name,\
    t.user_id,\
    t.amount,\
    t.comment\
    FROM transactions t LEFT JOIN users u ON t.user_id=u.id ${where}`;
  return lib.runDBQuery(query, 'Error while getting transactions', values);
}
