import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';

/**
 * /campaign DELETE
 * Удаление кампании
 */
export default async function deleteCampaign(req: express.Request, res: express.Response): Promise<any> {

  const { id } = req.params;

  const deleteRes: Types.OrmResult = await orm.campaign.deleteCampaign(parseInt(id, 10));
  if (deleteRes.error === 1) {
    console.warn(req.url, req.headers);
    const errRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: deleteRes.message,
      body: {
        stdErrMessage: deleteRes.data,
      },
    };
    return res.status(500).json(errRes);
  }

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Campaign deleted',
    body: {
      received: id,
    },
  };
  return res.status(201).json(successRes);
}
