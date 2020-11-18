import * as Types from '../../types';
import * as lib from '../../lib';
import * as orm from '../../orm';
import express from 'express';

/**
 * Получение кампаний по фильтрам.
 *  Имеет доступ только авторизованный, но без посредников selfCampaign и orAdmin,
 * так как нужна непосредственная выборка на роуте.
 * Принимает 3 body аргумента.
 * @self - это для админа, если он хочет получить только свои кампании self=1 иначе он видит все кампании.
 * @current - текущая страница
 * @limit - количество на странице 
 * @status - сортировка по статусу
 * @param req 
 * @param res 
 */
export default async function getCampaigns(req: express.Request, res: express.Response): Promise<any> {

  const { admin, uid }: any = req.headers;
  const user_id = parseInt(uid, 10);

  const { limit, current, self } = req.body;

  const fStatus: any = req.body.status;
  const status = !fStatus ? 'pending' : fStatus;

  if (lib.CampaignStatuses.indexOf(status) === -1) {
    const warnResStat: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Variable status should be on of enum values',
      body: {
        require: lib.CampaignStatuses,
      },
    };
    return res.status(400).json(warnResStat);
  }

  // Current не должен
  if (current === 0 || current === '0') {
    const warnCurRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Variable `current` can\'t have zero value',
      body: {},
    };
    return res.status(400).json(warnCurRes);
  }

  // Количество строк для пагинации
  let count = 0;
  let campaigns: Types.Campaign[];
  const start = limit * current - limit;
  // Для админа или свои, или свои для админа если self
  if (admin === '1' && !self) {
    // Если пределы не переданы берет все кампании для админа
    if (!limit && !current) {
      const allCampaigsRes: Types.OrmResult = await orm.campaign.getAll(status);
      if (allCampaigsRes.error === 1) {
        console.warn(`<${Date()}>`, '[Warning: allCampaignRes.error === 1]', {
          url: req.url,
          headers: req.headers,
        });
        const errorAll: Types.ServerHandlerResponse = {
          result: 'error',
          message: 'Error while get all campaigns',
          body: {
            stdErrMessage: allCampaigsRes.data,
          },
        };
        return res.status(500).json(errorAll);
      }
      campaigns = allCampaigsRes.data;
      count = campaigns.length;
    } else {
      // Когда переданы пределы для админа
      const countRes: Types.OrmResult = await orm.campaign.getCountAll();
      if (countRes.error === 1) {
        console.warn(`<${Date()}>`, '[Warning: countRes.error === 1]', {
          url: req.url,
          headers: req.headers,
        });
        const errorCount: Types.ServerHandlerResponse = {
          result: 'error',
          message: 'Error while get count of campaigns',
          body: {
            stdErrMessage: countRes.data,
          },
        };
        return res.status(500).json(errorCount);
      }
      count = countRes.data[0]['COUNT(*)'];
      const filterRes: Types.OrmResult = await orm.campaign.filterAll(status, start, limit);
      if (filterRes.error === 1) {
        console.warn(`<${Date()}>`, '[Warning: filterRes.error === 1]', {
          url: req.url,
          headers: req.headers,
        });
        const errFilterRes: Types.ServerHandlerResponse = {
          result: 'error',
          message: 'Error while get list of campaigns',
          body: {
            stdErrMessage: filterRes.data,
          },
        };
        return res.status(500).json(errFilterRes);
      }
      campaigns = filterRes.data;
    }
  } else {
    // Если пределы не переданы берет все свои
    if (!limit && !current) {
      const allCampaigsRes: Types.OrmResult = await orm.campaign.getAllByUid(status, user_id);
      if (allCampaigsRes.error === 1) {
        console.warn(`<${Date()}>`, '[Warning: allCampaignRes.error === 1]', {
          url: req.url,
          headers: req.headers,
        });
        const errorAll: Types.ServerHandlerResponse = {
          result: 'error',
          message: 'Error while get all campaigns',
          body: {
            stdErrMessage: allCampaigsRes.data,
          },
        };
        return res.status(500).json(errorAll);
      }
      campaigns = allCampaigsRes.data;
      count = campaigns.length;
    } else {
      // Если переданы то выбирает из своих
      const countRes: Types.OrmResult = await orm.campaign.getCountByUid(user_id);
      if (countRes.error === 1) {
        console.warn(`<${Date()}>`, '[Warning: countRes.error === 1]', {
          url: req.url,
          headers: req.headers,
        });
        const errorCount: Types.ServerHandlerResponse = {
          result: 'error',
          message: 'Error while get count of campaigns',
          body: {
            stdErrMessage: countRes.data,
          },
        };
        return res.status(500).json(errorCount);
      }
      count = countRes.data[0]['COUNT(*)'];
      const filterRes: Types.OrmResult = await orm.campaign.filterAllByUid(user_id, status, start, limit);
      if (filterRes.error === 1) {
        console.warn(`<${Date()}>`, '[Warning: filterRes.error === 1]', {
          url: req.url,
          headers: req.headers,
        });
        const errFilterRes: Types.ServerHandlerResponse = {
          result: 'error',
          message: 'Error while get list of your campaigns',
          body: {
            stdErrMessage: filterRes.data,
          },
        };
        return res.status(500).json(errFilterRes);
      }
      campaigns = filterRes.data;
    }
  }

  const succesOneRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Campaigns received',
    body: {
      campaigns,
      count,
    },
  };
  return res.status(200).json(succesOneRes);
}
