import * as Types from '../../types';
import * as lib from '../../lib';
import * as orm from '../../orm';
import express from 'express';

/**
 * /transaction GET
 * Получение транзакций
 * @filter {Types.TransactionFilter} - по какому полю фильтровать по дате или пользователю 
 * @value {Date | number} - значение, дата или ид пользователя
 * @self {1|0} - админ просит созданные им
 * @limit {number} - количество на странице
 * @current {number} - текущая страница
 */
export default async function getTranstactions(req: express.Request, res: express.Response): Promise<any> {

  const { uid, admin }: any = req.headers;
  let userId = parseInt(uid, 10);

  const { filter, value, self, limit, current }: any = req.body;

  // eslint-disable-next-line no-undefined
  if (filter !== undefined && lib.TransactionFilterVariants.indexOf(filter) === -1) {
    const warnRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Value of variable \'filter\' should be one of enum',
      body: {
        require: lib.TransactionFilterVariants,
        received: filter,
      },
    };
    return res.status(400).json(warnRes);
  }

  // eslint-disable-next-line no-undefined
  if (filter !== undefined && !value) {
    const warnRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Value of variable "value" cant be empty if filter is passed',
      body: {
        require: lib.TransactionFilterVariants,
        received: filter,
      },
    };
    return res.status(400).json(warnRes);
  }

  if (filter === 'user' && typeof value !== 'number') {
    const warnValRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'If value of variable \'filter\' is "user" that field \'value\' should be a number',
      body: {
        require: 'number',
        received: typeof value,
      },
    };
    return res.status(400).json(warnValRes);
  }

  if (filter === 'user' && self === 1) {
    const warnValRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'If value of variable \'filter\' is "user" that field \'self\' should be zero',
      body: {
        require: { self: 0 },
        received: { self },
      },
    };
    return res.status(400).json(warnValRes);
  }

  if (admin === '1' && self !== 1) {
    userId = -1;
  }

  // Current не должен быть нулевым
  if (current === 0) {
    const warnCurRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Variable `current` can\'t have zero value',
      body: {},
    };
    return res.status(400).json(warnCurRes);
  }

  // Начальный элемент выборки (для пагинации)
  const start = limit * current - limit;
  const getRes: Types.OrmResult = await orm.transaction.getTransactions(filter, value, start, limit, userId);
  if (getRes.error === 1) {
    console.warn(req.url, req.headers);
    const errRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: getRes.message,
      body: {
        stdErrMessage: getRes.data,
      },
    };
    return res.status(500).json(errRes);
  }

  const transactions: Types.Transaction[] = getRes.data;

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Transactions received',
    body: {
      transactions,
    },
  };
  return res.status(200).json(successRes);
}
