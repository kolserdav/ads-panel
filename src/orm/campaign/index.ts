/**
 * Медоды обращения к таблице campaign
 */

import * as Types from '../../types';
import * as lib from '../../lib';

/**
 * Создание новой кампании
 * @param campaign 
 */
export function createNew(campaign: Types.Campaign): Promise<Types.OrmResult> {
  const query = 'INSERT INTO `campaigns` (user_id, title, link, countries, price, budget, ip_pattern, white_list, black_list) VALUES (?,?,?,?,?,?,?,?,?)';
  const values = [
    campaign.user_id,
    campaign.title,
    campaign.link,
    JSON.stringify(campaign.countries),
    campaign.price,
    campaign.budget,
    JSON.stringify(campaign.ip_pattern),
    JSON.stringify(campaign.white_list),
    JSON.stringify(campaign.black_list),
  ];
  return lib.runDBQuery(query, 'Error create new campaign', values);
}

/**
 * Обновление ид оффера в кампании
 * @param offer_id 
 * @param id 
 */
export function updateOfferId(offer_id: number, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `campaigns` SET offer_id=?, updated=? WHERE id=?';
  const values = [
    offer_id,
    new Date(),
    id,
  ];
  return lib.runDBQuery(query, 'Error update offer_id for campaign', values);
}

/**
 * Удаление кампании
 * @param id 
 * @param id 
 */
export function deleteCampaign(id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE campaigns SET archive=1 WHERE campaigns.id=?';
  const values = [id];
  return lib.runDBQuery(query, 'Error delete campaign', values);
}


/**
 * Получение кампании по id
 * @param id 
 */
export function getById(id: number): Promise<Types.OrmResult> {
  const query = 'SELECT * FROM `campaigns` WHERE `id`=? AND archive=0';
  const values = [ id ];
  return lib.runDBQuery(query, 'Error get campaign by id', values);
}

/**
 * Обновление названия кампании
 * @param title 
 * @param id 
 */
export function updateTitle(title: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `campaigns` SET title=?, updated=? WHERE id=?';
  const values = [
    title,
    new Date(),
    id,
  ];
  return lib.runDBQuery(query, 'Error update campaign title', values);
}

/**
 * Обновление ссылки кампании
 * @param link 
 * @param id 
 */
export function updateLink(link: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `campaigns` SET link=?, updated=? WHERE id=?';
  const values = [
    link,
    new Date(),
    id,
  ];
  return lib.runDBQuery(query, 'Error update campaign link', values);
}

/**
 * Обновление постбек ссылки кампании
 * @param postback 
 * @param id 
 */
export function updatePostback(postback: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `campaigns` SET postback=?, updated=? WHERE id=?';
  const values = [
    postback,
    new Date(),
    id,
  ];
  return lib.runDBQuery(query, 'Error update campaign postback', values);
}

/**
 * Обновление списка стран кампании
 * @param countries 
 * @param id 
 */
export function updateCountries(countries: string[], id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `campaigns` SET countries=?, updated=? WHERE id=?';
  const values = [
    JSON.stringify(countries),
    new Date(),
    id,
  ];
  return lib.runDBQuery(query, 'Error update campaign countries', values);
}

/**
 * Обновление цены клика кампании
 * @param cost 
 * @param id 
 */
export function updateCost(cost: number, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `campaigns` SET price=?, updated=? WHERE id=?';
  const values = [
    cost,
    new Date(),
    id,
  ];
  return lib.runDBQuery(query, 'Error update campaign cost', values);
}

/**
 * Обновление бюджета кампании
 * @param budget 
 * @param id 
 */
export function updateBudget(budget: number, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `campaigns` SET budget=?, updated=? WHERE id=?';
  const values = [
    budget,
    new Date(),
    id,
  ];
  return lib.runDBQuery(query, 'Error update campaign budget', values);
}

/**
 * Обновление IP паттерна кампании
 * @param ip_pattern 
 * @param id 
 */
export function updateIPPattern(ip_pattern: string[], id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `campaigns` SET ip_pattern=?, updated=? WHERE id=?';
  const values = [
    JSON.stringify(ip_pattern),
    new Date(),
    id,
  ];
  return lib.runDBQuery(query, 'Error update campaign IP pattern', values);
}

/**
 * Обновление белого списка кампании
 * @param white_list 
 * @param id 
 */
export function updateWhitelist(white_list: string[], id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `campaigns` SET white_list=?, updated=? WHERE id=?';
  const values = [
    JSON.stringify(white_list),
    new Date(),
    id,
  ];
  return lib.runDBQuery(query, 'Error update campaign white list', values);
}

/**
 * Обновление черного списка кампании
 * @param black_list 
 * @param id 
 */
export function updateBlacklist(black_list: string[], id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `campaigns` SET black_list=?, updated=? WHERE id=?';
  const values = [
    JSON.stringify(black_list),
    new Date(),
    id,
  ];
  return lib.runDBQuery(query, 'Error update campaign black list', values);
}

/**
 * Обновление статуса
 * @param status 
 * @param id 
 */
export function updateStatus(status: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `campaigns` SET status=?, updated=? WHERE id=?';
  const values = [
    status,
    new Date(),
    id,
  ];
  return lib.runDBQuery(query, 'Error update campaign status', values);
}

/**
 * получает все кампании
 * @param status 
 */
export function getAll(status: string): Promise<Types.OrmResult> {
  const query = 'SELECT c.*, u.first_name, u.last_name, c.id as id, u.id as user_id, o.title as offer, o.archive as offer_archive FROM campaigns c LEFT JOIN users u ON c.user_id = u.id\
  LEFT JOIN offers o ON c.offer_id = o.id WHERE c.archive=0 ORDER BY CASE WHEN c.status=? THEN 1 ELSE 2 END ';
  const values = [ status ];
  return lib.runDBQuery(query, 'Error get all campaigns', values);
}

export function getAllByUid(status: string, user_id: number): Promise<Types.OrmResult> {
  const query = 'SELECT c.*, u.first_name, u.last_name, c.id as id, u.id as user_id, o.title as offer, o.archive as offer_archive FROM `campaigns` c LEFT JOIN users u ON c.user_id = u.id\
  LEFT JOIN offers o ON c.offer_id = o.id WHERE c.user_id=? AND c.archive=0 ORDER BY CASE WHEN c.status=? THEN 1 ELSE 2 END';
  const values = [ user_id, status ];
  return lib.runDBQuery(query, 'Error get all you campaigns', values);
}

/**
 * Фильтрует пагинацию с учетом user_id
 * @param user_id 
 * @param start - первый элемент
 * @param count - количество элементов
 */
export function filterAllByUid(user_id: number, status: string, start: number, count: number): Promise<Types.OrmResult> {
  const query = 'SELECT c.*, u.first_name, u.last_name, c.id as id, u.id as user_id, o.title as offer, o.archive as offer_archive\
   FROM `campaigns` c LEFT JOIN users u ON c.user_id = u.id LEFT JOIN offers o ON c.offer_id = o.id WHERE c.user_id=? AND c.archive=0 ORDER BY CASE WHEN c.status=? THEN 1 ELSE 2 END LIMIT ?,?';
  const values = [ user_id, status, start, count ];
  return lib.runDBQuery(query, 'Error get list of your campaigns', values);
}

/**
 * Фильтрует пагинацию среди всех кампаний
 * @param start - первый элемент
 * @param count - количество элементов
 */
export function filterAll(status: string, start: number, count: number): Promise<Types.OrmResult> {
  const query = 'SELECT c.*, u.first_name, u.last_name, c.id as id, u.id as user_id, o.title as offer, o.archive as offer_archive\
   FROM `campaigns` c LEFT JOIN users u ON c.user_id = u.id LEFT JOIN offers o ON c.offer_id = o.id WHERE c.archive=0 ORDER BY CASE WHEN c.status=? THEN 1 ELSE 2 END LIMIT ?,? ';
  const values = [ status, start, count ];
  return lib.runDBQuery(query, 'Error get list of campaigns', values);
}

/**
 * Получает общее количество кампаний
 */
export function getCountAll(): Promise<Types.OrmResult> {
  const query = 'SELECT COUNT(*) FROM `campaigns` WHERE archive=0';
  return lib.runDBQuery(query, 'Error get all count campaigns');
}

/**
 * Получает общее количество кампаний с учетом user_id
 * @param user_id 
 */
export function getCountByUid(user_id: number): Promise<Types.OrmResult> {
  const query = 'SELECT COUNT(*) FROM `campaigns` WHERE user_id=? AND archive=0';
  const values = [ user_id ];
  return lib.runDBQuery(query, 'Error get user count campaigns', values);
}
