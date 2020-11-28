import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';

/**
 * /countries GET
 * поиск страны по названию
 * search {string} - начало названия страны
 */
export default async function SearchCounries(req: express.Request, res: express.Response): Promise<any> {

  const { search }: any = req.query;

  const searchRes = await orm.countries.searchCountries(search);

  const countries = searchRes.data;

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Counries list received',
    body: {
      countries,
    },
  };
  return res.status(200).json(successRes);
}
