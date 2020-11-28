import * as Types from '../../types';
import * as lib from '../../lib';
import * as orm from '../../orm';
import express from 'express';

/**
 * /campaign/status PUT
 * Изменение статуса кампании.
 * Скрыто за посредниками auth, и onlyAdmin
 * @status {Types.CampaignStatus} - статус
 */
export default async function putStatusCampaign(req: express.Request, res: express.Response): Promise<any> {

  const { status } = req.body;
  const { id } = req.params;
  const cId = parseInt(id, 10);

  const statuses: Types.CampaignStatus[] = lib.CampaignStatuses;

  if (statuses.indexOf(status) === -1) {
    const warnRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Status of campaign should be one of enums',
      body: {
        require: statuses,
      },
    };
    return res.status(400).json(warnRes);
  }

  const changeRes: Types.OrmResult = await orm.campaign.updateStatus(status, cId);
  if (changeRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: changeRes.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    const errRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: 'Error while change campaign status',
      body: {
        stdErrMessage: changeRes.data,
      },
    };
    return res.status(500).json(errRes);
  }

  if (changeRes.data.changedRows === 0) {
    const warningRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Campaign not found',
      body: {},
    };
    return res.status(404).json(warningRes);
  }

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Status of campaign is changed',
    body: {},
  };
  return res.status(201).json(successRes);
}
