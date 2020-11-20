import * as Types from '../../types';
import * as lib from '../../lib';
import * as orm from '../../orm';
import express from 'express';


/**
 * /user/confirm GET
 *  Подтверждение почты
 *  Ожидает QueryString e=email и k=key
 *  Которые сформированы из ссылки отправленой при регистрации  
 * 
 * @e {string} - почта 
 * @k {string} - ключ
 */
export default async function getConfirmUser(req: express.Request, res: express.Response): Promise<any> {

  const { e, k }: any = req.query;

  const email: string = e;
  const key = k;

  // Одна ошибка на разные случаи, чтобы не угадывалась логика
  const errMess = 'Некоректный запрос';
  const errRes = {
    result: 'warning',
    message: errMess,
    body: {},
  };

  if (!email) {
    return res.status(400).json(errRes);
  }

  if (!lib.checkEmail(email) || !key) {
    return res.status(400).json(errRes);
  }

  const getByEmailRes: Types.OrmResult = await orm.user.getByEmail(email);

  if (getByEmailRes.error === 1) {
    return res.status(500).json({
      result: 'error',
      message: 'Ошибка при получении данных пользователя',
      body: {
        stdErrMessage: getByEmailRes.data,
      },
    });
  }

  if (getByEmailRes.data.length === 0) {
    return res.status(400).json(errRes);
  }

  const user: Types.User = getByEmailRes.data[0];

  if (user.confirm !== 0) {
    return res.status(400).json({
      result: 'warning',
      message: 'Почта была подтверждена ранее',
      body: {
        email,
      },
    });
  }

  // Проверяет соответсвует ли ключ последнему времени updated
  // @ts-ignore
  if (!lib.checkKey(user.updated, key)) {
    return res.status(400).json(errRes);
  }

  // Проверяет не прошло ли времени больше чем указано .env LINK_EXPIRE от user.updated
  // @ts-ignore
  if (lib.checkDateExpire(user.updated)) {
    return res.status(403).json({
      result: 'warning',
      message: 'Ссылка подтверждения почты просрочена',
      body: {
        email,
      },
    });
  }

  const uid: any = user.id;
  const confirmRes: Types.OrmResult = await orm.user.confirm(uid);

  if (confirmRes.error === 1) {
    return res.status(500).json({
      result: 'error',
      message: 'Ошибка подтверждения почты',
      body: {
        stdErrMessage: confirmRes.data,
      },
    });
  }

  return res.status(201).json({
    result: 'success',
    message: 'Почта успешно подтверждена',
    body: {
      email,
    },
  });
}
