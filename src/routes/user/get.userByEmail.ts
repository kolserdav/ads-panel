import * as lib from '../../lib';
import * as orm from '../../orm';
import express from 'express';

/**
 *  Обработчик вызова /user GET в результате отвечает success если почта доступна для регистрации
 * @param req 
 * @param res 
 */
export default async function getUserByEmail(req: express.Request, res: express.Response): Promise<any> {

  const { email }: any = req.query;

  if (!email) {
    return res.status(400).json({
      result: 'warning',
      message: 'Адрес почты не передан',
      body: {},
    });
  }

  if (!lib.checkEmail(email)) {
    return res.status(400).json({
      result: 'warning',
      message: 'Адрес почты имеет неверный формат',
      body: {},
    });
  }

  const getRes = await orm.user.getByEmail(email);

  if (getRes.error === 1) {
    return res.status(500).json({
      result: 'error',
      message: 'Ошибка получения пользователя по почте',
      body: {
        stdErrMessage: getRes.data,
      },
    });
  }

  if (getRes.data.length === 0) {
    return res.status(404).json({
      result: 'success',
      message: 'Почта доступна для регистрации',
      body: {
        email,
      },
    });
  }

  return res.status(200).json({
    result: 'warning',
    message: 'На данную почту уже существует учетная запись',
    body: {
      email,
    },
  });
}
