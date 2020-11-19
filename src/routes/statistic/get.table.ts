import * as Types from '../../types';
import * as lib from '../../lib';
import * as orm from '../../orm';
import express from 'express';

/**
 * /statistic/table GET
 * Возвращает статистику для таблицы, группированную по одному из типов
 *  @limit {number} - количество эелементов на странице
    @current {number} - запрашиваемая страница
    @group {Types.GroupBy} - по какому полю сгруппировать
    @time {Types.Time} - шаблон отсчета времени
    @customTime {number?} - количество дней отнять от сегодня
    @self {number?} - когда админ запрашивает для себя
 */
export default async function getAllStatistic(req: express.Request, res: express.Response): Promise<any> {

  const { uid, admin }: any = req.headers;
  const userId = parseInt(uid, 10);

  const {
    limit,
    current,
    group,
    time,
    customTime,
    self,
  } = req.body;

  let customTimeInt = 0;

  // проверяет что time один из приемлемых TODO если убрать то просто будет за сегодня
  // eslint-disable-next-line no-undefined
  if (time !== undefined) {
    if (lib.TimeShiftVariants.indexOf(time) === -1) {
      const warnTimeRes: Types.ServerHandlerResponse = {
        result: 'warning',
        message: 'Value of variable "time" should be one of enums',
        body: {
          require: lib.TimeShiftVariants,
          received: time,
        },
      };
      return res.status(400).json(warnTimeRes);
    }
    // eslint-disable-next-line no-undefined
    if (time === 'custom' && customTime === undefined) {
      const warnCustomT: Types.ServerHandlerResponse = {
        result: 'warning',
        message: 'With value of "time" as "custom" need pass "customTime" variable',
        body: {
          require: 'customTime',
          received: customTime,
        },
      };
      return res.status(400).json(warnCustomT);
    }
    customTimeInt = parseInt(customTime, 10);
  }

  // Проверяет соответствует ли группировка возможным вариантам TODO убирать нельзя, иначе нужно дорабатывать orm
  // eslint-disable-next-line no-undefined
  if (group !== undefined) {
    if (lib.GroupByVariants.indexOf(group) === -1) {
      const warnGroupRes: Types.ServerHandlerResponse = {
        result: 'warning',
        message: 'Value of variable "group" should be one of enums',
        body: {
          require: lib.GroupByVariants,
          received: group,
        },
      };
      return res.status(400).json(warnGroupRes);
    }
  }

  // Current не должен быть нулевым
  if (current === 0 || current === '0') {
    const warnCurRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Variable `current` can\'t have zero value',
      body: {},
    };
    return res.status(400).json(warnCurRes);
  }

  // Начальный элемент выборки (для пагинации)
  const start = limit * current - limit;
  // если админ запрашивает свои кампании
  const uId = admin === '1' && self !== 1 ? null : userId;
  const getRes: Types.OrmResult = await orm.statistic.getTableStatistic(uId, start, limit, group, time, customTimeInt);
  if (getRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: todayRes.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    const getError: Types.ServerHandlerResponse = {
      result: 'error',
      message: 'Error getting statistic',
      body: {
        stdErrMessage: getRes.data,
      },
    };
    return res.status(500).json(getError);
  }
  const statisticsRaw: Types.TableStatistic[] = getRes.data;

  // Вычисляет ctr и процент выигрыша для строки в таблице
  const table = statisticsRaw.map((item: Types.TableStatistic) => {
    const newItem: Types.TableStatistic = {
      ...item,
      win_ratio: Math.ceil(item.requests / item.impressions * 100),
      ctr: parseFloat((item.clicks / item.impressions).toFixed(2)),
    };
    return newItem;
  });

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Statistic received',
    body: {
      table,
    },
  };

  return res.status(200).json(successRes);
}
