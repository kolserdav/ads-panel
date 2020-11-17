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
  const id = parseInt(uid, 10);

  const {
    email,
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
    const updateRes: Types.OrmResult = await orm.user.changeUpdated(dateNow, id);
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
    // Если идёт смена email
    let newEmail = xxemail;
    if (email) {
      if (email !== xxemail) {
        if (!lib.checkEmail(email)) {
          return res.status(400).json({
            result: 'warning',
            message: 'Адрес почты имеет неверный формат',
            body: {},
          });
        }
        newEmail = email;
        const getByEmailRes: Types.OrmResult = await orm.user.getByEmail(email);
        if (getByEmailRes.error === 1) {
          console.warn(`<${Date()}>`, '[Wwarning: getByEmailRes.error === 1]', {
            url: req.url,
            headers: req.headers,
          });
          const errGetRes: Types.ServerHandlerResponse = {
            result: 'error',
            message: 'Ошибка проверки почты',
            body: {
              stdErrMessage: getByEmailRes.data,
            },
          };
          return res.status(500).json(errGetRes);
        }
        if (getByEmailRes.data.length !== 0) {
          const warnRes: Types.ServerHandlerResponse = {
            result: 'warning',
            message: 'Переданная почта уже занята и не может быть использована',
            body: {
              email,
            },
          };
          return res.status(400).json(warnRes);
        }
        const changeEmailRes: Types.OrmResult = await orm.user.changeEmail(email, id);
        if (changeEmailRes.error === 1) {
          console.warn(`<${Date()}>`, '[Warning: changeEmailRes.error === 1]', {
            url: req.url,
            headers: req.headers,
          });
          const errRes: Types.ServerHandlerResponse = {
            result: 'error',
            message: 'Ошибка смены почты',
            body: {
              stdErrMessage: changeEmailRes.data,
            },
          };
          return res.status(500).json(errRes);
        }
      }
    }
    // Отправляет письмо с передачей timestamp для генерации ключа
    const sendRes: Types.OrmResult = await utils.getConfirmEmail(newEmail, dateNow, name, host);
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
        email: newEmail,
      },
    };
    return res.status(201).json(sendConfirmRes);
  }

  // Смена имени
  if (first_name) {
    const updateName: Types.OrmResult = await orm.user.changeFirstName(first_name, id);
    if (updateName.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateName.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const errChangeName: Types.ServerHandlerResponse = {
        result: 'error',
        message: 'Ошибка при смене имени',
        body: {
          stdErrMessage: updateName.data,
        },
      };
      return res.status(500).json(errChangeName);
    }
  }

  // Смена фамилии
  if (last_name) {
    const updateLastName: Types.OrmResult = await orm.user.changeLastName(last_name, id);
    if (updateLastName.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateLastName.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const errChangeLastName: Types.ServerHandlerResponse = {
        result: 'error',
        message: 'Ошибка при смене фамилии',
        body: {
          stdErrMessage: updateLastName.data,
        },
      };
      return res.status(500).json(errChangeLastName);
    }
  }

  // Смена компании 
  if (company) {
    const updateCompany: Types.OrmResult = await orm.user.changeCompany(company, id);
    if (updateCompany.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateCompany.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const errChangeCompany: Types.ServerHandlerResponse = {
        result: 'error',
        message: 'Ошибка при смене компании',
        body: {
          stdErrMessage: updateCompany.data,
        },
      };
      return res.status(500).json(errChangeCompany);
    }
  }

  // Смена скайпа
  if (skype) {
    const updateSkype: Types.OrmResult = await orm.user.changeSkype(skype, id);
    if (updateSkype.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateSkype.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const errChangeSkype: Types.ServerHandlerResponse = {
        result: 'error',
        message: 'Ошибка при смене скайпа',
        body: {
          stdErrMessage: updateSkype.data,
        },
      };
      return res.status(500).json(errChangeSkype);
    }
  }

  return res.status(201).json({
    result: 'success',
    message: 'Данные пользователя успешно обновлены',
    body: req.body,

  });
}
