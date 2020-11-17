import * as Types from '../../types';
import * as orm from '../../orm';
import express from 'express';

export default async function postCreateCampaign(req: express.Request, res: express.Response): Promise<any> {

  const { uid }: any = req.headers;
  const user_id = parseInt(uid, 10);

  const {
    title,
    link,
    postback,
    countries,
    cost,
    budget,
    ip_pattern,
    white_list,
    black_list,
  }: any = req.body;

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
  if (!postback) {
    const warnPostbackRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Постбек ссылка не передана',
      body: {},
    };
    return res.status(400).json(warnPostbackRes);
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
  if (!cost) {
    const warnCostRes: Types.ServerHandlerResponse = {
      result: 'warning',
      message: 'Цена клика не указана',
      body: {},
    };
    return res.status(400).json(warnCostRes);
  }
  if (typeof cost !== 'number') {
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
      body: {},
    };
    return res.status(500).json(warnRes);
  }

  const successRes: Types.ServerHandlerResponse = {
    result: 'success',
    message: 'Кампания создана',
    body: {
      campaign,
    },
  };
  return res.status(201).json(successRes);
}
