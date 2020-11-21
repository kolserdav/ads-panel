import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';

/**
 * /offer/:id
 * Получает оффера по id, доступно только создателю и админу.
 */
export default async function getOffer(req: express.Request, res: express.Response): Promise<any> {

  const { id } = req.params;
  const offerId = parseInt(id, 10);

  const getRes: Types.OrmResult = await orm.offer.getById(offerId);
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

  const offer: Types.Offer = getRes.data[0];

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Offer received',
    body: {
      offer,
    },
  };
  return res.status(200).json(successRes);
}
