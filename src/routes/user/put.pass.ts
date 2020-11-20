import * as Types from '../../types';
import * as lib from '../../lib';
import * as orm from '../../orm';
import express from 'express';
import sha256 from 'sha256';

const { PASSWORD_MIN }: any = process.env;


/**
 * PUT /user/pass
 * Смена пароля
 * Ожидает заголовок xx-token сформированный через POST /user/forgot - при переходе по ссылке из письма или обновленный, через
 * GET /user/forgot.
 * Также обязательно передаем email, password, password_repeat
 * @password {string} 
 * @password_repeat {string} 
 * @email {string}
 */
export default async function putPass(req: express.Request, res: express.Response): Promise<any> {


  const { password, password_repeat, email } = req.body;

  const token = req.headers['xx-token'];

  // Одна ошибка на разные случаи, чтобы не угадывалась логика
  const errMess = 'Некоректный токен запроса';
  const errRes = {
    result: 'warning',
    message: errMess,
    body: {},
  };

  if (!email) {
    return res.status(400).json(errRes);
  }

  if (!lib.checkEmail(email) || !token) {
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

  // Проверяет соответсвует ли ключ последнему времени updated
  // @ts-ignore
  if (!lib.checkKey(user.updated, token)) {
    return res.status(400).json(errRes);
  }

  // Проверяет не прошло ли времени больше чем указано .env LINK_EXPIRE от user.updated
  // @ts-ignore
  if (lib.checkDateExpire(user.updated)) {
    return res.status(403).json({
      result: 'warning',
      message: 'Ссылка смены пароля просрочена',
      body: {
        email,
      },
    });
  }

  if (!password) {
    return res.status(400).json({
      result: 'warning',
      message: 'Пароль не передан',
      body: {},
    });
  }

  if (!password_repeat) {
    return res.status(400).json({
      result: 'warning',
      message: 'Повтор пароля не передан',
      body: {},
    });
  }

  if (password.length < parseInt(PASSWORD_MIN, 10)) {
    return res.status(400).json({
      result: 'warning',
      message: `Пароль не может быть короче ${PASSWORD_MIN} символов.`,
      body: {},
    });
  }

  if (password !== password_repeat) {
    return res.status(400).json({
      result: 'warning',
      message: 'Пароли не совпадают',
      body: {},
    });
  }

  const uid: any = user.id;
  const changeRes: Types.OrmResult = await orm.user.changePassword(sha256(password), uid);
  if (changeRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: changeRes.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    const errRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: 'Ошибка изменения пароля',
      body: {
        stdErrMessage: changeRes.data,
      },
    };
    return res.status(500).json(errRes);
  }

  return res.status(201).json({
    result: 'success',
    message: 'Пароль успешно изменен',
    body: {},
  });
}
