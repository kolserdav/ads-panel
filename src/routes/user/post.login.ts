import * as Types from '../../types';
import * as lib from '../../lib';
import * as orm from '../../orm';
import express from 'express';
import sha256 from 'sha256';

export default async function postLogin(req: express.Request, res: express.Response): Promise<any> {

  const { email, password }: any = req.body;

  const getByEmailRes: Types.OrmResult = await orm.user.getByEmail(email);

  if (getByEmailRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: getByEmailRes.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    const errorRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: 'Ошибка получения данных пользователя',
      body: {
        stdErrMessage: getByEmailRes.data,
      },
    };
    return res.status(500).json(errorRes);
  }

  // Одна ошибка на разные случаи, чтобы не угадывалась логика
  const errMess = 'Емайл или пароль не совпадают';
  const warnRes: Types.ServerHandlerResponse = {
    result: 'warning',
    message: errMess,
    body: {},
  };

  if (getByEmailRes.data.length === 0) {
    return res.status(403).json(warnRes);
  }

  const user = getByEmailRes.data[0];

  if (user.password !== sha256(password)) {
    return res.status(403).json(warnRes);
  }

  const userAgent: any = req.headers['user-agent'];

  const token = lib.createToken(user.id, email, userAgent, sha256(password));

  const result: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Вход выполнен успешно',
    body: {
      token,
    },
  };

  return res.status(201).json(result);
}
