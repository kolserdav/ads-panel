import * as Types from '../../types';
import * as lib from '../../lib';
import * as orm from '../../orm';
import express from 'express';

/**
 *  /statistic/graph GET
 *  Получает статистику для графика, группировку выполняет в зависимости от временного шаблона,
 *  или по времени, или по дням, неделям и т.д. 
 *  @self {1|0} - админ смотрит все или только свои
    @time {Types.Time} - временной шаблон
    @customTime {number} - время в днях если time = custom
 */
export default async function getGraphStatistic(req: express.Request, res: express.Response): Promise<any> {

  const {
    self,
    time,
    customTime,
  } = req.body;

  const { uid, admin }: any = req.headers;
  const uId = admin === '1' && self !== 1 ? null : parseInt(uid, 10);

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

  const statiscticsRes: Types.OrmResult = await orm.statistic.getGraphStatistic(uId, time, customTimeInt);
  if (statiscticsRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: statisticsRes.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    const errRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: 'Error while get graph statistic',
      body: {
        stdErrMessage: statiscticsRes.data,
      },
    };
    return res.status(500).json(errRes);
  }

  // eslint-disable-next-line prefer-destructuring
  const graph: Types.TableStatistic[] = statiscticsRes.data;

  /**
   * Подсчитывает все значения временного промежутка
   */
  const all = {
    clicks: 0,
    requests: 0,
    cost: 0,
    impressions: 0,
  };
  graph.map((item: Types.TableStatistic) => {
    all.clicks += item.clicks;
    all.requests += item.requests;
    all.cost += item.cost;
    all.impressions += item.impressions;
  });

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Graph statistic received',
    body: {
      all,
      graph,
    },
  };
  return res.status(200).json(successRes);
}
