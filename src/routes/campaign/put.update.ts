import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';

/**
 * /campaign/:id PUT
 *  Обновление данных кампании.
 *  @title {string}
    @link {string}
    @countries {string[]}
    @price {string[]}
    @budget {number}
    @ip_pattern {string[]}
    @white_list {string[]}
    @black_list {string[]}
    @offer_id {number}
    Можно менять по одному или все вместе.
 */
export default async function putUpdateCampaign(req: express.Request, res: express.Response): Promise<any> {

  const {
    title,
    link,
    countries,
    price,
    budget,
    ip_pattern,
    white_list,
    black_list,
    offer_id,
  }: Types.Campaign = req.body;

  const { id } = req.params;
  const cId = parseInt(id, 10);

  const { uid }: any = req.headers;
  const userId = parseInt(uid, 10);

  if (title) {
    const updateTitRes: Types.OrmResult = await orm.campaign.updateTitle(title, cId);
    if (updateTitRes.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateTitRes.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const errUpdateTit: Types.ServerHandlerResponse = {
        result: 'error',
        message: updateTitRes.message,
        body: {
          stdErrMessage: updateTitRes.data,
        },
      };
      return res.status(500).json(errUpdateTit);
    }
  }

  if (link) {
    const updateLinRes: Types.OrmResult = await orm.campaign.updateLink(link, cId);
    if (updateLinRes.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateLinRes.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const errUpdateLin: Types.ServerHandlerResponse = {
        result: 'error',
        message: updateLinRes.message,
        body: {
          stdErrMessage: updateLinRes.data,
        },
      };
      return res.status(500).json(errUpdateLin);
    }
  }

  if (countries) {
    if (!Array.isArray(countries)) {
      const warnCountArrRes: Types.ServerHandlerResponse = {
        result: 'warning',
        message: 'Список стран передан в неверном формате',
        body: {},
      };
      return res.status(400).json(warnCountArrRes);
    }
    const updateCountrRes: Types.OrmResult = await orm.campaign.updateCountries(countries, cId);
    if (updateCountrRes.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateCountrRes.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const errUpdateCountr: Types.ServerHandlerResponse = {
        result: 'error',
        message: 'Ошибка изменения списка стран кампании',
        body: {
          stdErrMessage: updateCountrRes.data,
        },
      };
      return res.status(500).json(errUpdateCountr);
    }
  }

  if (price) {
    const updateCostRes: Types.OrmResult = await orm.campaign.updateCost(price, cId);
    if (updateCostRes.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateCostRes.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const errUpdateCost: Types.ServerHandlerResponse = {
        result: 'error',
        message: 'Ошибка изменения цены клика кампании',
        body: {
          stdErrMessage: updateCostRes.data,
        },
      };
      return res.status(500).json(errUpdateCost);
    }
  }

  if (budget) {
    const updateBudgetRes: Types.OrmResult = await orm.campaign.updateBudget(budget, cId);
    if (updateBudgetRes.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateBudgetRes.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const errUpdateBudg: Types.ServerHandlerResponse = {
        result: 'error',
        message: 'Ошибка изменения бюджета кампании',
        body: {
          stdErrMessage: updateBudgetRes.data,
        },
      };
      return res.status(500).json(errUpdateBudg);
    }
  }

  if (ip_pattern) {
    if (!Array.isArray(ip_pattern)) {
      const warnIPArrRes: Types.ServerHandlerResponse = {
        result: 'warning',
        message: 'IP паттерн передан в неверном формате',
        body: {},
      };
      return res.status(400).json(warnIPArrRes);
    }
    const updateIPRes: Types.OrmResult = await orm.campaign.updateIPPattern(ip_pattern, cId);
    if (updateIPRes.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateIPRes.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const errUpdateIP: Types.ServerHandlerResponse = {
        result: 'error',
        message: 'Ошибка изменения IP паттерна кампании',
        body: {
          stdErrMessage: updateIPRes.data,
        },
      };
      return res.status(500).json(errUpdateIP);
    }
  }

  if (white_list) {
    if (!Array.isArray(white_list)) {
      const warnWLArrRes: Types.ServerHandlerResponse = {
        result: 'warning',
        message: 'Белый список передан в неверном формате',
        body: {},
      };
      return res.status(400).json(warnWLArrRes);
    }
    const updateWLRes: Types.OrmResult = await orm.campaign.updateWhitelist(white_list, cId);
    if (updateWLRes.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateWLRes.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const errUpdateWL: Types.ServerHandlerResponse = {
        result: 'error',
        message: 'Ошибка изменения белого списка кампании',
        body: {
          stdErrMessage: updateWLRes.data,
        },
      };
      return res.status(500).json(errUpdateWL);
    }
  }

  if (black_list) {
    if (!Array.isArray(black_list)) {
      const warnBLArrRes: Types.ServerHandlerResponse = {
        result: 'warning',
        message: 'Чёрный список передан в неверном формате',
        body: {},
      };
      return res.status(400).json(warnBLArrRes);
    }
    const updateBLRes: Types.OrmResult = await orm.campaign.updateBlacklist(black_list, cId);
    if (updateBLRes.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateBLRes.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const errUpdateBL: Types.ServerHandlerResponse = {
        result: 'error',
        message: 'Ошибка изменения чёрного списка кампании',
        body: {
          stdErrMessage: updateBLRes.data,
        },
      };
      return res.status(500).json(errUpdateBL);
    }
  }

  if (offer_id) {
    // проверяет есть ли такой оффер
    const offerRes: Types.OrmResult = await orm.offer.getById(offer_id);
    if (offerRes.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: offerRes.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const offerErr: Types.ServerHandlerResponse = {
        result: 'error',
        message: 'Ошибка получения оффера',
        body: {
          stdErrMessage: offerRes.data,
        },
      };
      return res.status(500).json(offerErr);
    }
    // eslint-disable-next-line prefer-destructuring
    const offer: Types.Offer = offerRes.data[0];
    if (!offer) {
      const offerWarn: Types.ServerHandlerResponse = {
        result: 'warning',
        message: 'Оффер не найден',
        body: {},
      };
      return res.status(404).json(offerWarn);
    }
    // Проверяет принадлежит ли оффер пользователю
    if (offer.user_id !== userId) {
      const warnRes: Types.ServerHandlerResponse = {
        result: 'warning',
        message: 'Данный оффер нельзя прикрепить',
        body: {},
      };
      return res.status(403).json(warnRes);
    }
    const updateOfferIdRes: Types.OrmResult = await orm.campaign.updateOfferId(offer_id, cId);
    if (updateOfferIdRes.error === 1) {
      console.warn(`<${Date()}>`, '[Warning: updateOfferIdRes.error === 1]', {
        url: req.url,
        headers: req.headers,
      });
      const errUpdId: Types.ServerHandlerResponse = {
        result: 'error',
        message: 'Ошибка прикрепления оффера к кампании',
        body: {
          stdErrMessage: updateOfferIdRes.data,
        },
      };
      return res.status(500).json(errUpdId);
    }
  }

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Кампания успешно обновлена',
    body: {},
  };
  return res.status(201).json(successRes);
}
