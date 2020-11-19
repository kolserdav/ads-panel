import * as Types from '../../types';
import * as lib from '../../lib';
import * as orm from '../../orm';
import express from 'express';

/**
 * /transaction GET
 * Получение транзакций
 * @filter {Types.TransactionFilter} - по какому полю фильтровать по дате или пользователю 
 * @value {Date | number} - значение, дата или ид пользователя
 */
export default async function getTranstactions(req: express.Request, res: express.Response): Promise<any> {

  const { filter, value }: any = req.body;

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

  const getRes: Types.OrmResult = await orm.transaction.getTransactions(filter, value);
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
