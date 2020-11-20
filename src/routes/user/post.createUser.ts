import * as Types from '../../types';
import * as lib from '../../lib';
import * as orm from '../../orm';
import * as utils from '../../utils';
import express from 'express';
import sha256 from 'sha256';

const { PASSWORD_MIN }: any = process.env;

/**
 * /user POST
 *  Регистрация пользователя.
 *  @email {string} - почта
    @first_name {string} - имя
    @last_name {string} - фамилия
    @password {string} - пароль
    @password_repeat {string} - повтор пароля
    @company {string} - компания
    @skype {string} - скайп
 * 
    При успешной регистрации отправляет письмо с сылкой подтверждения почты
 * @param req 
 * @param res 
 */
export default async function postCreateUser(req: express.Request, res: express.Response): Promise<any> {

  const {
    email,
    first_name,
    last_name,
    password,
    password_repeat,
    company,
    skype,
  }: any = req.body;

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

  if (getByEmail.data.length !== 0) {
    return res.status(400).json({
      result: 'warning',
      message: 'Данная почта уже зарегистрирована на сервисе',
      body: {
        email,
      },
    });
  }

  if (!first_name) {
    return res.status(400).json({
      result: 'warning',
      message: 'Имя не указано',
      body: {},
    });
  }

  if (!last_name) {
    return res.status(400).json({
      result: 'warning',
      message: 'Фамилия не указана',
      body: {},
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

  if (!company) {
    return res.status(400).json({
      result: 'warning',
      message: 'Компания не указана',
      body: {},
    });
  }

  if (!skype) {
    return res.status(400).json({
      result: 'warning',
      message: 'Скайп не передан',
      body: {},
    });
  }

  const dateNow = Date.now();

  const saveRes: Types.OrmResult = await orm.user.createNew({
    first_name,
    last_name,
    email,
    password: sha256(password),
    company,
    skype,
    updated: new Date(dateNow),
  });

  if (saveRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: saveRes.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    return res.status(500).json({
      result: 'error',
      message: 'Ошибка сохранения данных нового пользователя',
      body: {
        stdErrMessage: saveRes.data,
      },
    });
  }

  const { host }: any = req.headers;

  const sendRes: Types.OrmResult = await utils.getConfirmEmail(email, dateNow, first_name, host);

  const userAgent: any = req.headers['user-agent'];

  const token = lib.createToken(saveRes.data.insertId, 0, email, userAgent, sha256(password));

  if (sendRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: sendRes.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    return res.status(502).json({
      result: 'success',
      message: 'Пользователь сохранен, но письмо подтверждения почты не было отправлено',
      body: {
        stdErrMessage: sendRes.data,
        token,
      },
    });
  }

  return res.status(201).json({
    result: 'success',
    message: 'Успешная регистрация нового пользователя. На указанную почту было отправлено письмо подтверждения.',
    body: {
      token,
    },
  });
}
