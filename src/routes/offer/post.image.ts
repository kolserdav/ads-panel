import * as Types from '../../types';


export default async function postImageOffer(req: any, res: any) {

  if (!req.imageFile) {
    const warnRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Изображение не передано',
      body: {
        stdErrMessage: "Require 'image' FormData",
      },
    };
    return res.status(400).json(warnRes);
  }

  const url = `/img/${req.imageDir}/${req.imageFile.originalname}`;

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Изображение добавлено',
    body: {
      url,
    },
  };
  return res.status(201).json(successRes);
}
