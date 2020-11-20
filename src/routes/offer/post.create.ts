import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';


/**
 * /offer POST
 *  Создание нового оффера.
 *  Ид пользователя берет из токена при аутентификации вызова.
 *  Принимает 'title', 'comment'.
 * @title {string} - название
 * @description {string} - описание
 */
export default async function postCreateOffer(req: express.Request, res: express.Response): Promise<any> {

  const { uid }: any = req.headers;
  const user_id = parseInt(uid, 10);

  const {
    title,
    description,
  }: any = req.body;

  if (!title) {
    const warnTitleRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Название оффера не может быть пустым',
      body: {},
    };
    return res.status(400).json(warnTitleRes);
  }
  if (!description) {
    const warnCommentRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Описание не может быть пустым',
      body: {},
    };
    return res.status(400).json(warnCommentRes);
  }

  const offer: Types.Offer = { user_id, ...req.body };

  const createRes: Types.OrmResult = await orm.offer.createNew(offer);
  if (createRes.error === 1) {
    console.warn(`<${Date}>`, '[Warning: createRes.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    const errRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: 'Ошибка при создании оффера',
      body: {
        stdErrMessage: createRes.data,
      },
    };
    return res.status(500).json(errRes);
  }

  const { insertId } = createRes.data;
  offer.id = insertId;

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Оффер успешно создан',
    body: {
      offer,
    },
  };
  return res.status(201).json(successRes);
}
