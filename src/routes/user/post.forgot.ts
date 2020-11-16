import * as Types from '../../types';
import * as lib from '../../lib';
import * as orm from '../../orm';
import * as utils from '../../utils';
import express from 'express';

/**
 * Запрос на смену пароля POST /user/forgot. 
 * Передаётся почта в email, создается и отправляется ключ, который при переходе на GET /user/forgot
 * проверяет ключ и генерирует токен на смену пароля. 
 * @param req 
 * @param res 
 */
export default async function postForgot(req: express.Request, res: express.Response): Promise<any> {

  const { email } = req.body;

  const { host }: any = req.headers;

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

  const getByEmail: Types.OrmResult = await orm.user.getByEmail(email);

  if (getByEmail.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: getByEmail.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    return res.status(500).json({
      result: 'error',
      message: 'Ошибка проверки почты пользователя',
      body: {
        stdErrMessage: getByEmail.data,
      },
    });
  }

  if (getByEmail.data.length === 0) {
    return res.status(400).json({
      result: 'warning',
      message: 'Указанная почта не найдена',
      body: {
        email,
      },
    });
  }

  const user: Types.User = getByEmail.data[0];
  const uid: any = user.id;

  const dateNow = Date.now();
  // Изменяет updated на основе timestamp
  const updateRes: Types.OrmResult = await orm.user.changeUpdated(dateNow, uid);
  if (updateRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: updateRes.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    const updateWarnRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: 'Ошибка генерации ключа ссылки',
      body: {
        stdErrMessage: updateRes.data,
      },
    };
    return res.status(500).json(updateWarnRes);
  }
  // Отправляет письмо с сылкой на смену пароля
  const sendRes: Types.OrmResult = await utils.getForgotEmail(user.email, dateNow, user.first_name, host);
  if (sendRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: sendRes.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    return res.status(502).json({
      result: 'error',
      message: 'Не удалось отправить письмо с ссылкой на смену пароля',
      body: {
        stdErrMessage: sendRes.data,
      },
    });
  }
  const sendConfirmRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Письмо с сcылкой подтверждения отправлено на указанный адрес почты',
    body: {
      email,
    },
  };
  return res.status(201).json(sendConfirmRes);
}
