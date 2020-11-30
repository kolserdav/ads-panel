import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';

/**
 * /offer/get POST
 * Получение списка офферов
 * self {1|0} - своих ли список офферов запрашивает админ  
 * limit {number} - количество на странице
 * current {number} - номер страницы
 */
export default async function getOffers(req: express.Request, res: express.Response): Promise<any> {

  const { self, limit, current }: any = req.body;

  const { uid, admin }: any = req.headers;
  const userId = parseInt(uid, 10);
  const uId = admin === '1' && self !== 1 ? -1 : userId;
  // Current не должен быть нулевым
  if (current === 0) {
    const warnCurRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Variable `current` can\'t have zero value',
      body: {},
    };
    return res.status(400).json(warnCurRes);
  }

  // Сначала берем количество
  const getCountRes: Types.OrmResult = await orm.offer.getCount(uId);
  if (getCountRes.error === 1) {
    console.warn(req.headers);
    const errGetCountRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: getCountRes.message,
      body: {
        stdErrMessage: getCountRes.data,
      },
    };
    return res.status(500).json(errGetCountRes);
  }
  const { count } = getCountRes.data[0];

  // Начальный элемент выборки (для пагинации)
  const start = limit * current - limit;
  const getRes: Types.OrmResult = await orm.offer.getAll(uId, start, limit);
  if (getRes.error === 1) {
    console.warn(req.headers);
    const errGetRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: getRes.message,
      body: {
        stdErrMessage: getRes.data,
      },
    };
    return res.status(500).json(errGetRes);
  }

  const offers: Types.Offer[] = getRes.data;
  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Offers received',
    body: {
      count,
      offers,
    },
  };
  return res.status(200).json(successRes);
}
