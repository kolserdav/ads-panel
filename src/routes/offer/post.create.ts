import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';

export default async function postCreateOffer(req: any, res: express.Response): Promise<any> {

  const { uid }: any = req.headers;
  const user_id = parseInt(uid, 10);

  const {
    title,
    image,
    comment,
  }: any = req.body;
  console.log(req.iconFile, req.imageFile);
  if (!title && !req.iconFile && !req.imageFile) {
    const warnTitleRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Название оффера не может быть пустым',
      body: {},
    };
    return res.status(400).json(warnTitleRes);
  }


  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Оффер успешно создан',
    body: {},
  };
  return res.status(201).json(successRes);
}
