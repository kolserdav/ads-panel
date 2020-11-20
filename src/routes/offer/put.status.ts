import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';

/**
 * /offer/status PUT
 * Изменение статуса оффера.
 * Скрыто за посредниками auth, и onlyAdmin
 * @status {Types.OffferStatus} - статус
 * @warning {string?}
 */
export default async function putStatusOffer(req: express.Request, res: express.Response): Promise<any> {

  const { status, warning } = req.body;
  const { id } = req.params;
  const oId = parseInt(id, 10);

  const statuses: Types.OfferStatus[] = ['verified', 'pending', 'warning'];

  if (statuses.indexOf(status) === -1) {
    const warnRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Status of offer should be one of enums',
      body: {
        require: statuses,
      },
    };
    return res.status(400).json(warnRes);
  }

  if (status === 'warning' && !warning) {
    const warnMessRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'You need pass warning message',
      body: {
        received: status,
      },
    };
    return res.status(400).json(warnMessRes);
  }

  if (status === 'warning') {
    const updateWarnRes: Types.OrmResult = await orm.offer.updateWarning(warning, oId);
    if (updateWarnRes.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateWarnRes.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const warnUp: Types.ServerHandlerResponse = {
        result: 'warning',
        message: 'Error while set warning message',
        body: {
          stdErrMessage: updateWarnRes.data,
        },
      };
      return res.status(500).json(warnUp);
    }
  }

  const changeRes: Types.OrmResult = await orm.offer.updateStatus(status, oId);
  if (changeRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: changeRes.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    const errRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: 'Error while change offer status',
      body: {
        stdErrMessage: changeRes.data,
      },
    };
    return res.status(500).json(errRes);
  }

  if (changeRes.data.changedRows === 0) {
    const warningRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Offer not found',
      body: {},
    };
    return res.status(404).json(warningRes);
  }

  const successRes: Types.ServerHandlerResponse = {
    result: 'warning',
    message: 'Status of offer is changed',
    body: {},
  };
  return res.status(201).json(successRes);
}
