import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';
import fs from 'fs';
import path from 'path';

/**
 * /offer/image/:id POST
 * Изменяет изображение оффера. Ожидает передаваемое изображение в multipart.
 * Название FormData объекта 'image'
 * @param req 
 * @param res 
 */
export default async function postImageOffer(req: express.Request, res: express.Response): Promise<any> {

  const { id } = req.params;

  // @ts-ignore
  const imagePath = path.resolve(__dirname, `../../../public/${req.offer.image}`);
  fs.unlink(imagePath, (e) => {
    //
  });

  const { imageFile, imageDir }: any = req;

  const url = imageFile ? `/img/offers/${imageDir}/${imageFile.originalname}` : '';
  const updateRes: Types.OrmResult = await orm.offer.changeImage(url, parseInt(id, 10));
  if (updateRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: updateRes.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    const warnUpdateIRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Ошибка при изменении изображения оффера',
      body: {
        stdErrMessage: updateRes.data,
      },
    };
    return res.status(500).json(warnUpdateIRes);
  }

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: imageFile ? 'Offer image changed' : 'Offer image deleted',
    body: {
      url,
    },
  };
  return res.status(201).json(successRes);
}
