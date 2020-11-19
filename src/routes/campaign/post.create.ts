import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';

/**
 * /campaign POST
 * Создание кампании. 
 *  @title {string} - Название
    @link {string} - Ссылка
    @countries {string[]} - Список кодов стран
    @price {number} - Цена клика
    @budget {number} - Бюджет
    @ip_pattern {string[]} - Список ip адресов
    @white_list {string[]} - Черный список
    @black_list {string[]} - Белый список
    @offer_id {number} - ID оффера
 */
export default async function postCreateCampaign(req: express.Request, res: express.Response): Promise<any> {

  const { uid }: any = req.headers;
  const user_id = parseInt(uid, 10);

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

  // Последовательная проверка переданных параметров
  if (!title) {
    const warnTitleRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Название кампании не может быть пустым',
      body: {},
    };
    return res.status(400).json(warnTitleRes);
  }
  if (!link) {
    const warnLinkRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Ссылка кампании не указана',
      body: {},
    };
    return res.status(400).json(warnLinkRes);
  }
  if (!countries) {
    const warnCountrRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Список стран не передан',
      body: {},
    };
    return res.status(400).json(warnCountrRes);
  }
  if (!Array.isArray(countries)) {
    const warnCountArrRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Список стран передан в неверном формате',
      body: {},
    };
    return res.status(400).json(warnCountArrRes);
  }
  if (!price) {
    const warnCostRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Цена клика не указана',
      body: {},
    };
    return res.status(400).json(warnCostRes);
  }
  if (typeof price !== 'number') {
    const warnCostNumRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Стоимостью клика должно быть число',
      body: {},
    };
    return res.status(400).json(warnCostNumRes);
  }
  if (!budget) {
    const warnBudgRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Бюджет кампании не указан',
      body: {},
    };
    return res.status(400).json(warnBudgRes);
  }
  if (typeof budget !== 'number') {
    const warnBudgetNumRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Величиной бюджета должно быть число',
      body: {},
    };
    return res.status(400).json(warnBudgetNumRes);
  }
  if (!ip_pattern) {
    const warnIpPatRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'IP паттерн не ввыбран',
      body: {},
    };
    return res.status(400).json(warnIpPatRes);
  }
  if (!Array.isArray(ip_pattern)) {
    const warnIPArrRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'IP паттерн передан в неверном формате',
      body: {},
    };
    return res.status(400).json(warnIPArrRes);
  }
  if (!white_list) {
    const warnWhiteRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Белый список адресов не выбран',
      body: {},
    };
    return res.status(400).json(warnWhiteRes);
  }
  if (!Array.isArray(white_list)) {
    const warnWhiteArrRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Белый список передан в неверном формате',
      body: {},
    };
    return res.status(400).json(warnWhiteArrRes);
  }
  if (!black_list) {
    const warnBlackRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Черный список адресов не указан',
      body: {},
    };
    return res.status(400).json(warnBlackRes);
  }
  if (!Array.isArray(black_list)) {
    const warnBlackArrRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Черный список передан в неверном формате',
      body: {},
    };
    return res.status(400).json(warnBlackArrRes);
  }

  // Проверка оффера перед записью
  if (offer_id) {
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
    if (offer.user_id !== user_id) {
      const warnRes: Types.ServerHandlerResponse = {
        result: 'warning',
        message: 'Данный оффер нельзя прикрепить',
        body: {},
      };
      return res.status(403).json(warnRes);
    }
  }

  // Записывает в базу 
  const campaign: Types.Campaign = { user_id, ...req.body };
  const saveRes: Types.OrmResult = await orm.campaign.createNew(campaign);
  if (saveRes.error === 1) {
    console.warn(`<${Date()}>`, '[Warning: saveRes.error === 1]', {
      url: req.url,
      headers: req.headers,
    });
    const warnRes: Types.ServerHandlerResponse = {
      result: 'error',
      message: 'Ошибка создания кампании',
      body: {
        stdErrMessage: saveRes.data,
      },
    };
    return res.status(500).json(warnRes);
  }

  // Прикрепление оффера
  if (offer_id) {
    const updateOfferIdRes: Types.OrmResult = await orm.campaign.updateOfferId(offer_id, saveRes.data.insertId);
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
    message: 'Кампания создана',
    body: {
      campaign: { id: saveRes.data.insertId, ...campaign },
    },
  };
  return res.status(201).json(successRes);
}
