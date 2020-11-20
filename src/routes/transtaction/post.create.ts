import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';

/**
 * /transaction POST
 * Создание транзакции
 * @amount {number} - сумма
 * @comment {string} - комментарий
 */
export default async function postCreateTransaction(req: express.Request, res: express.Response): Promise<any> {

  const {
    amount,
    comment,
  }: Types.Transaction = req.body;

  const { uid }: any = req.headers;
  const userId = parseInt(uid, 10);

  const createRes: Types.OrmResult = await orm.transaction.createTransaction(userId, amount, comment);
  if (createRes.error === 1) {
    console.warn(req.url, req.headers);
    const errRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: createRes.message,
      body: {
        stdErrMessage: createRes.data,
      },
    };
    return res.status(500).json(errRes);
  }

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Transaction created',
    body: {
      insertId: createRes.data.insertId,
    },
  };
  return res.status(201).json(successRes);
}
