import * as Types from '../types';
import * as lib from '../lib';
import * as orm from '../orm';
import express from 'express';


/**
 *  Посредник авторизации, проверяет токен в заголовке xx-auth,
 *  если токен актуален то пропускает дальше, если нет то возвращает статус 403
 * @param req 
 * @param res 
 * @param next 
 */
export async function auth(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {

  const token: any = req.headers['xx-auth'];

  const parsedToken = lib.parseToken(token);

  const errRes: Types.ServerHandlerResponse = {
    result: 'warning',
    message: 'Только для авторизованных пользователей',
    body: {
      errAuth: true,
    },
  };

  if (parsedToken.id === -1 || parsedToken.userAgent !== req.headers['user-agent']) {
    return res.status(403).json(errRes);
  }

  const userById: Types.OrmResult = await orm.user.getById(parsedToken.id);

  if (userById.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: userById.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    const warnRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: 'Ошибка получения информации пользователя',
      body: {
        stdErrMessage: userById.data,
      },
    };
    return res.status(500).json(warnRes);
  }

  if (userById.data.length === 0) {
    return res.status(403).json(errRes);
  }

  const user: Types.User = userById.data[0];

  if (user.email !== parsedToken.email || user.password !== parsedToken.password) {
    return res.status(403).json(errRes);
  }

  req.headers.uid = parsedToken.id.toString();
  req.headers.xxemail = parsedToken.email;
  req.headers.name = user.first_name;

  next();
}
