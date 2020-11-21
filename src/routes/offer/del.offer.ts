import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';

/**
 * /offer/:id DELETE
 * Удаление оффера, доступно толко создателю, помечается archive=1 и не возвращается в выборках 
 */
export default async function deleteOffer(req: express.Request, res: express.Response): Promise<any> {

  const { id } = req.params;

  const delRes: Types.OrmResult = await orm.offer.deleteOffer(parseInt(id, 10));
  if (delRes.error === 1) {
    console.warn(req.headers);
    const errDelRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: delRes.message,
      body: {
        stdErrMessage: delRes.data,
      },
    };
    return res.status(500).json(errDelRes);
  }

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Offer deleted',
    body: {},
  };
  return res.status(201).json(successRes);
}
