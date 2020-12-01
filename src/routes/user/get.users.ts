import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';

const { MAX_DB_ID }: any = process.env;

/**
 * /user/admin GET 
 * Получение пользователей для админа
 * limit {number} - количество на странице
 * current {number} - текущая страница
 */
export default async function getUsers(req: express.Request, res: express.Response): Promise<any> {

  const { limit, current }: any = req.query;

  const numReg = /^\d+$/;
  let _limit = parseInt(MAX_DB_ID, 10);
  let _current = 1;

  if (typeof limit === 'string' && typeof current === 'string') {
    if (!numReg.test(limit) || !numReg.test(current)) {
      const warnRes: Types.ServerHandlerResponse = {
        result: 'warning',
        message: 'Limit and current must be a number',
        body: {
          require: {
            limit: 'number',
            current: 'number',
          },
          received: {
            limit,
            current,
          },
        },
      };
      return res.status(400).json(warnRes);
    }
    _limit = parseInt(limit, 10);
    _current = parseInt(current, 10);
    if (_current === 0) {
      // Current не должен быть нулевым
      const warnCurRes: Types.ServerHandlerResponse = {
        result: 'warning',
        message: 'Variable `current` can`t have zero value',
        body: {},
      };
      return res.status(400).json(warnCurRes);
    }
  }
  const start = _limit * _current - _limit;

  const getCount: Types.OrmResult = await orm.user.getCount();
  if (getCount.error === 1) {
    const countWarnRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: getCount.message,
      body: {
        stdErrMessage: getCount.data,
      },
    };
    return res.status(500).json(countWarnRes);
  }

  const { count } = getCount.data[0];

  const getRes: Types.OrmResult = await orm.user.getAll(start, _limit);
  if (getRes.error === 1) {
    const errRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: getRes.message,
      body: {
        stdErrMessage: getRes.data,
      },
    };
    return res.status(500).json(errRes);
  }

  const users = getRes.data;

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Users received',
    body: {
      count,
      users,
    },
  };
  return res.status(200).json(successRes);
}
