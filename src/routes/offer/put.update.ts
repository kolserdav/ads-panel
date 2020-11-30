import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';

/**
 * /offer PUT
 * Изменение Названия и комментария оффера.
 *  Принимает title и description, если передан один из них то меняет только его, 
 *  если ничего не передано, ничего не меняет. если переданы оба, то меняет оба последовательно.
 * @title {string} - название
 * @description {string} - описание
 */
export default async function putUpdateOffer(req: express.Request, res: express.Response): Promise<any> {

  const { id } = req.params;
  const offerId = parseInt(id, 10);
  const { title, description }: any = req.body;

  if (title) {
    const updateTitleRes: Types.OrmResult = await orm.offer.updateTitle(title, offerId);
    if (updateTitleRes.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateTitleRes.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const warnTitRes: Types.ServerHandlerResponse = {
        result: 'error',
        message: 'Ошибка обновления названия оффера',
        body: {
          stdErrMessage: updateTitleRes.data,
        },
      };
      return res.status(500).json(warnTitRes);
    }
  }

  if (description) {
    const updateCommentRes: Types.OrmResult = await orm.offer.updateComment(description, offerId);
    if (updateCommentRes.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateCommentRes.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const warnComRes: Types.ServerHandlerResponse = {
        result: 'error',
        message: 'Ошибка обновления комментария оффера',
        body: {
          stdErrMessage: updateCommentRes.data,
        },
      };
      return res.status(500).json(warnComRes);
    }
  }

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Оффер успешно изменён',
    body: {
      id,
      ...req.body,
    },
  };
  return res.status(201).json(successRes);
}
