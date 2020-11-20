import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';

/**
 * Получение кампании по id.
 *  Имеет доступ только создатель и админы. Благодаря посредникам selfCampaign и orAdmin
 */
export default async function getCampaign(req: express.Request, res: express.Response): Promise<any> {

  const { id } = req.params;
  const cId = parseInt(id, 10);

  const getOneRes: Types.OrmResult = await orm.campaign.getById(cId);
  if (getOneRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: getOneRes.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    const errGetOne: Types.ServerHandlerResponse = {
      result: 'error',
      message: 'Error while getting campaign',
      body: {
        stdErrMessage: getOneRes.data,
      },
    };
    return res.status(500).json(errGetOne);
  }
  // eslint-disable-next-line prefer-destructuring
  const campaign = getOneRes.data[0];
  if (!campaign) {
    const warnNotFound: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Campaign not found',
      body: {},
    };
    return res.status(404).json(warnNotFound);
  }
  const succesOneRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Campaign received',
    body: {
      campaign,
    },
  };
  return res.status(200).json(succesOneRes);
}
