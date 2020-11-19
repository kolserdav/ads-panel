import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';


/**
 * /user/session GET
 * Возвращает данные пользователя. Защищен посредником auth.
 * @param req 
 * @param res 
 */
export default async function getSession(req: express.Request, res: express.Response): Promise<any> {

  const { uid }: any = req.headers;
  const id = parseInt(uid, 10);

  const user: Types.OrmResult = await orm.user.getById(id);
  if (user.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: user.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    const errRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: 'Ошибка получения данных пользователя',
      body: {
        stdErrMessage: user.data,
      },
    };
    return res.status(500).json(errRes);
  }

  // eslint-disable-next-line prefer-destructuring
  const User: Types.User = user.data[0];

  User.password = '';

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Данные пользователя получены',
    body: {
      user: User,
    },
  };
  return res.status(200).json(successRes);
}
