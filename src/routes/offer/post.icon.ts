import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';


/**
 * /offer/icon/:id POST
 * Изменяет иконку оффера. Ожидает передаваемую иконку в multipart.
 * Название FormData объекта 'icon'
 * @param req 
 * @param res 
 */
export default async function postIconOffer(req: express.Request, res: express.Response): Promise<any> {

  const { id } = req.params;

  const { imageFile, imageDir }: any = req;

  if (!imageFile) {
    const warnRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Иконка не передана',
      body: {
        stdErrMessage: "Require 'icon' FormData",
      },
    };
    return res.status(400).json(warnRes);
  }

  const url = `/img/${imageDir}/${imageFile.originalname}`;
  const updateRes: Types.OrmResult = await orm.offer.changeIcon(url, parseInt(id, 10));
  if (updateRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: updateRes.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    const warnUpdateIRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Ошибка при изменении иконки оффера',
      body: {
        stdErrMessage: updateRes.data,
      },
    };
    return res.status(500).json(warnUpdateIRes);
  }

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Иконка добавлена',
    body: {
      url,
    },
  };
  return res.status(201).json(successRes);
}
