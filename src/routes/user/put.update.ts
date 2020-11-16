import * as Types from '../../types';
import * as lib from '../../lib';
import * as orm from '../../orm';
import * as utils from '../../utils';
import express from 'express';

/**
 *  Изменение данных пользователя. 
 * Открыто только для пользователя с токеном переданным в заголовке xx-auth
 * ID пользователя сервер берет из токена расшифровывая его секретным ключом из .env - JWT_SECRET.
 * @param req 
 * @param res 
 */

export default async function (req: express.Request, res: express.Response): Promise<any> {

  const { uid }: any = req.headers;

  const {
    email,
    password,
    password_repeat,
    first_name,
    last_name,
    company,
    skype,
    sendConfirm,
  }: any = req.body;


  // Если передан sendConfirm - то обновляет updated пользователя, формирует ссылку с ключем по updated времени и отправляет письмо
  // Берет timestamp
  const dateNow = Date.now();
  const { host, xxemail, name }: any = req.headers;
  if (sendConfirm === 1 || parseInt(sendConfirm, 10) === 1) {
    // Изменяет updated на основе timestamp
    const updateRes: Types.OrmResult = await orm.user.changeUpdated(dateNow, parseInt(uid, 10));
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
    // Отправляет письмо с передачей timestamp для генерации ключа
    const sendRes: Types.OrmResult = await utils.getConfirmEmail(xxemail, dateNow, name, host);
    if (sendRes.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: sendRes.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      return res.status(502).json({
        result: 'error',
        message: 'Не удалось отправить письмо подтверждения почты',
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

  return res.status(201).json({
    result: 'success',
    message: 'Данные пользователя успешно обновлены',
    body: {

    },
  });
}
