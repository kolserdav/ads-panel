/**
 * Файл запросов к базе по статистике
 */

import * as Types from '../../types';
import * as lib from '../../lib';
import connection from '../connection';

/**
 * 
 * Берет статистику для таблицы. Группирует в зависимости от параметров.
 * 
 * @param user_id - ид пользователя, если не как админ 
 * @param start - начальный элемент выборки для пагинации
 * @param count - количество элементов возвращаемой выборки
 * @param groupBy - по какому полю группирует результат
 * @param time - вариант времени
 * @param customTime - количество дней отнять от сегодня
 */
export function getTableStatistic(user_id: number | null, start: number, count: number,
  groupBy: Types.GroupBy, time: Types.Time, customTime: number): Promise<Types.OrmResult> {

  const user = user_id !== null ? `AND c.user_id=${user_id}` : '';
  const first = start ? start : 0;
  const all = count ? count : 18446744073709550000;
  let group: string;
  switch (groupBy) {
    case 'campaign':
      group = 'h.campaign';
      break;
    case 'country':
      group = 'h.country';
      break;
    case 'user':
      group = 'c.user_id';
      break;
    case 'subid':
      group = 'h.subid';
      break;
    case 'date':
      group = 'h.date';
      break;
    default:
      group = 'h.campaign';
  }

  // Если сегодня то из hourly...
  const table = time === 'today' ? 'hourly' : 'daily';

  return new Promise(resolve => {
    connection.query(
      `SELECT ${group},\
      MIN(h.date) as dateMin,\
      MAX(h.date) as dateMax,\
      Count(*) as count,\
      u.first_name,\
      u.last_name,\
      c.user_id,\
      SUM(h.cost) as cost,\
      CAST(SUM(h.requests) AS INTEGER) as requests,\
      CAST(SUM(h.clicks) AS INTEGER) as clicks,\
      CAST(SUM(h.impressions) AS INTEGER) as impressions \
      FROM ${table} h LEFT JOIN campaigns c ON h.campaign = c.id \
      LEFT JOIN users u ON c.user_id = u.id \
      WHERE h.date>=? ${user} GROUP BY ${group} LIMIT ?,?`,
      [
        lib.calculateDate(time, customTime).time,
        first,
        all,
      ],
      (err, results) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error get table statistic]', err);
          resolve({
            error: 1,
            data: err.message,
          });
        }
        resolve({
          error: 0,
          data: results,
        });
      },
    );
  });
}


/**
 * Получает всю статистику пользователя или всю для админа
 * @param userId {null | number} -если null то всех пользователей если есть, то только для указанного пользователя
 * @param time {Types.Time} - шаблон выборки времени
 * @param customTime {number?} - когда time === custom
 */
export function getGraphStatistic(userId: number | null, time: Types.Time, customTime: number): Promise<Types.OrmResult> {

  const user = userId !== null ? `AND c.user_id=${userId}` : '';

  // Если сегодня то из hourly...
  const table = time === 'today' ? 'hourly' : 'daily';
  const date = lib.calculateDate(time, customTime);
  return new Promise(resolve => {
    connection.query(
      `SELECT MIN(h.date) as dateMin,\
      MAX(h.date) as dateMax,\
      Count(*) as count,\
      SUM(h.cost) as cost,\
      CAST(SUM(h.requests) AS INTEGER) as requests,\
      CAST(SUM(h.clicks) AS INTEGER) as clicks,\
      CAST(SUM(h.impressions) AS INTEGER) as impressions \
      FROM ${table} h LEFT JOIN campaigns c ON h.campaign = c.id \
      WHERE h.date>=? ${user} GROUP BY ${date.range}`,
      [date.time],
      (err, results) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error get all statistic]', err);
          resolve({
            error: 1,
            data: err.message,
          });
        }
        resolve({
          error: 0,
          data: results,
        });
      },
    );
  });
}
