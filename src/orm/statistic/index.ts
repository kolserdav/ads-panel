/**
 * Файл запросов к базе по статистике
 */

import * as Types from '../../types';
import * as lib from '../../lib';

const { MAX_DB_ID }: any = process.env;

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
  groupBy: Types.GroupBy, time: Types.Time, customTime: Date[], orderBy: string, desc: boolean, campaign: number | undefined): Promise<Types.OrmResult> {

  const user = user_id !== null ? `AND c.user_id=${user_id}` : '';
  const first = start ? start : 0;
  const all = count ? count : parseInt(MAX_DB_ID, 10);
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

  const by = desc === true ? 'DESC' : 'ASC';
  const oBy = orderBy ? orderBy : 'date';
  const order = `ORDER BY ${oBy} ${by}`;

  // Если сегодня то из hourly...
  const table = time === 'today' ? 'hourly' : 'daily';

  let whereDate, values;
  if (customTime.length === 0) {
    whereDate = 'h.date>=?';
    values = [
      lib.calculateDate(time, customTime).time,
      first,
      all,
    ];
  } else {
    whereDate = 'h.date>=? AND h.date<=?';
    values = [
      customTime[0],
      customTime[1],
      first,
      all,
    ];
  }

  // eslint-disable-next-line no-undefined
  const whereCampaign = campaign !== undefined ? `AND h.campaign=${campaign}` : '';

  const query = `SELECT ${group},\
    MIN(h.date) as dateMin,\
    MAX(h.date) as dateMax,\
    Count(*) as count,\
    u.first_name,\
    u.last_name,\
    c.user_id,\
    h.subid,\
    h.country,\
    c.title,\
    SUM(h.cost) as cost,\
    CAST(SUM(h.requests) AS INTEGER) as requests,\
    CAST(SUM(h.clicks) AS INTEGER) as clicks,\
    CAST(SUM(h.impressions) AS INTEGER) as impressions \
    FROM ${table} h LEFT JOIN campaigns c ON h.campaign = c.id \
    LEFT JOIN users u ON c.user_id = u.id \
    WHERE ${whereDate} ${user} ${whereCampaign} GROUP BY ${group} ${order} LIMIT ?,?`;
  return lib.runDBQuery(query, 'Error get table statistic', values);
}


/**
 * Получает всю статистику пользователя или всю для админа
 * @param userId {null | number} -если null то всех пользователей если есть, то только для указанного пользователя
 * @param time {Types.Time} - шаблон выборки времени
 * @param customTime {number?} - когда time === custom
 */
export function getGraphStatistic(userId: number | null, time: Types.Time, customTime: Date[], campaign: number | undefined): Promise<Types.OrmResult> {

  const user = userId !== null ? `AND c.user_id=${userId}` : '';

  // Если сегодня то из hourly...
  const table = time === 'today' ? 'hourly' : 'daily';
  const date = lib.calculateDate(time, customTime);
  let whereDate, values;
  if (customTime.length === 0) {
    whereDate = 'h.date>=?';
    values = [date.time];
  } else {
    whereDate = 'h.date>=? AND h.date<=?';
    values = [
      customTime[0],
      customTime[1],
    ];
  }

  // eslint-disable-next-line no-undefined
  const whereCampaign = campaign !== undefined ? `AND h.campaign=${campaign}` : '';

  const query = `SELECT MIN(h.date) as dateMin,\
    MAX(h.date) as dateMax,\
    Count(*) as count,\
    SUM(h.cost) as cost,\
    CAST(SUM(h.requests) AS INTEGER) as requests,\
    CAST(SUM(h.clicks) AS INTEGER) as clicks,\
    CAST(SUM(h.impressions) AS INTEGER) as impressions \
    FROM ${table} h LEFT JOIN campaigns c ON h.campaign = c.id \
    WHERE ${whereDate} ${user} ${whereCampaign} GROUP BY ${date.range} ORDER BY date ASC`;
  return lib.runDBQuery(query, 'Error get all statistic', values);
}
