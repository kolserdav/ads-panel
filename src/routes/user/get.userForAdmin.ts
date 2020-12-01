import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';

/**
 * /user/:id GET
 * Получение пользователя по id, нужно сткрывать за посредником onlyAdmin
 */
export default async function geUserForAdmin(req: express.Request, res: express.Response): Promise<any> {

  const { id } = req.params;

  const getRes: Types.OrmResult = await orm.user.getById(parseInt(id, 10));
  if (getRes.error === 1) {
    console.warn(req.headers);
    const errRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: getRes.message,
      body: {
        stdErrMessage: getRes.data,
      },
    };
    return res.status(500).json(errRes);
  }

  const user: Types.User = getRes.data[0];

  if (!user) {
    const warnRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'User not found',
      body: {},
    };
    return res.status(404).json(warnRes);
  }

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'User received',
    body: {
      user,
    },
  };
  return res.status(200).json(successRes);
}