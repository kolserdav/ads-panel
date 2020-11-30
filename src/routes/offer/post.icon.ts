import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';
import fs from 'fs';
import path from 'path';

/**
 * /offer/icon/:id POST
 * Изменяет иконку оффера. Ожидает передаваемую иконку в multipart.
 * Название FormData объекта 'icon'
 * @icon {FormData}
 */
export default async function postIconOffer(req: express.Request, res: express.Response): Promise<any> {

  const { id } = req.params;

  // @ts-ignore
  const iconPath = path.resolve(__dirname, `../../../public/${req.offer.icon}`);
  fs.unlink(iconPath, (e) => {
    //
  });

  const { imageFile, imageDir }: any = req;

  const url = imageFile ? `/img/offers/${imageDir}/${imageFile.originalname}` : '';
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
    message: imageFile ? 'Offer icon changed' : 'Offer icon deleted',
    body: {
      url,
    },
  };
  return res.status(201).json(successRes);
}
