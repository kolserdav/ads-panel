import * as Types from '../../types';
import * as lib from '../../lib';
import * as orm from '../../orm';
import express from 'express';


/**
 * /user/forgot GET
 *  Запрос токена смены пароля 
 *  Ожидает QueryString e=email и k=key
 *  Которые сформированы из ссылки отправленой при запросе смены пароля  
 *  Внимание с одним key генерация токена смены пароля сработает только один раз, 
 *  для повторной генерации нового токена нужно передавать полученный токен вместо key.
 *  Полученный здесь токен смены пароля работает в смене пароля по PUT /user/pass 
 * @e {string} - почта
 * @k {string} - ключ
 */
export default async function getForgot(req: express.Request, res: express.Response): Promise<any> {

  const { e, k }: any = req.query;

  const email: string = e;
  const key = k;

  // Одна ошибка на разные случаи, чтобы не угадывалась логика
  const errMess = 'Некоректный запрос токена';
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
      message: 'Ссылка смены пароля просрочена',
      body: {
        email,
      },
    });
  }

  const dateNow = Date.now();
  const uid: any = user.id;
  const confirmRes: Types.OrmResult = await orm.user.changeUpdated(dateNow, uid);

  if (confirmRes.error === 1) {
    return res.status(500).json({
      result: 'error',
      message: 'Ошибка получения токена смены пароля',
      body: {
        stdErrMessage: confirmRes.data,
      },
    });
  }

  const forgotToken = lib.encodeBase64(new Date(dateNow).toString());

  return res.status(201).json({
    result: 'success',
    message: 'Токен смены пароля получен',
    body: {
      forgotToken,
    },
  });
}
