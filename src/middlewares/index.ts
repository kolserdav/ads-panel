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

  // eslint-disable-next-line prefer-destructuring
  const user: Types.User = userById.data[0];

  if (user.email !== parsedToken.email || user.password !== parsedToken.password || user.id !== parsedToken.id || user.admin !== parsedToken.admin) {
    return res.status(403).json(errRes);
  }

  req.headers.uid = parsedToken.id.toString();
  req.headers.xxemail = parsedToken.email;
  req.headers.name = user.first_name;
  req.headers.admin = parsedToken.admin.toString();

  next();
}

/**
 * Посредник, который проверяет, что операцию по офферу производит его владелец
 * Внимание! Обязательно использовать только после посредника auth, так как ожидает заголовок uid
 * @param req 
 * @param res 
 * @param next 
 */
export async function selfOffer(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {

  const { uid }: any = req.headers;
  const user_id = parseInt(uid, 10);
  const { id } = req.params;

  const getOfferRes: Types.OrmResult = await orm.offer.getById(parseInt(id, 10));
  if (getOfferRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: getOfferRes.error === 1]', {
      id,
      url: req.url,
      headers: req.headers,
    });
    const errRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: 'Ошибка при проверке принадлежности оффера',
      body: {
        stdErrMessage: getOfferRes.data,
      },
    };
    return res.status(500).json(errRes);
  }

  // eslint-disable-next-line prefer-destructuring
  const offer: Types.Offer = getOfferRes.data[0];
  if (!offer) {
    const warnOffNotEx: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Оффер не найден',
      body: {
        offer,
      },
    };
    return res.status(404).json(warnOffNotEx);
  }

  // Закрывает доступ пользователю если он не значится в user_id оффера. За исключением админов перед тем где это указано посредником orAdmin
  if (user_id !== offer.user_id && req.headers.orAdmin !== '1') {
    const warnRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Эта комманда доступна только создателю оффера',
      body: {},
    };
    return res.status(403).json(warnRes);
  }
  // @ts-ignore
  req.offer = offer;
  next();

}

/**
 * Посредник, который проверяет, что операцию по кампании производит его владелец
 * Внимание! Обязательно использовать только после посредника auth, так как ожидает заголовок uid
 * @param req 
 * @param res 
 * @param next 
 */
export async function selfCampaign(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {

  const { uid }: any = req.headers;
  const user_id = parseInt(uid, 10);
  const { id } = req.params;

  const getCampaignRes: Types.OrmResult = await orm.campaign.getById(parseInt(id, 10));
  if (getCampaignRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: getCampaignRes.error === 1]', {
      id,
      url: req.url,
      headers: req.headers,
    });
    const errRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: 'Ошибка при проверке принадлежности кампании',
      body: {
        stdErrMessage: getCampaignRes.data,
      },
    };
    return res.status(500).json(errRes);
  }

  // eslint-disable-next-line prefer-destructuring
  const campaign: Types.Campaign = getCampaignRes.data[0];
  if (!campaign) {
    const warnCamNotEx: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Кампания не найдена',
      body: {
        campaign,
      },
    };
    return res.status(404).json(warnCamNotEx);
  }
  // Закрывает доступ пользователю если он не значится в user_id кампании. За исключением админов перед тем где это указано посредником orAdmin
  if (user_id !== campaign.user_id && req.headers.orAdmin !== '1') {
    const warnRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Эта комманда доступна только создателю кампании',
      body: {},
    };
    return res.status(403).json(warnRes);
  }

  next();

}

/**
 * Посредник закрывающий ресурс для всех кроме администраторов.
 * Обязательно использовать после посредника auth!
 * @param req 
 * @param res 
 * @param next 
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function onlyAdmin(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {

  const { admin }: any = req.headers;
  const _isAdmin = parseInt(admin, 10);
  if (_isAdmin !== 1) {
    const warnRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Permission denied',
      body: {
        errRole: true,
      },
    };
    return res.status(403).json(warnRes);
  }

  next();

}

/**
 * Посредник который добавляет заголовок orAdmin,
 * что позволяет открывать админу доступ на self посредники, перед которыми он используется.
 * @param req 
 * @param res 
 * @param next 
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function orAdmin(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {

  req.headers.orAdmin = req.headers.admin;
  next();
}
