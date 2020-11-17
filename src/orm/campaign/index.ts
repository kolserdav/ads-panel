import * as Types from '../../types';
import connection from '../connection';

/**
 * Создание новой кампании
 * @param campaign 
 */
export function createNew(campaign: Types.Campaign): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'INSERT INTO `campaigns` (user_id, title, link, postback, countries, cost, budget, ip_pattern, white_list, black_list) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [
        campaign.user_id,
        campaign.title,
        campaign.link,
        campaign.postback,
        JSON.stringify(campaign.countries),
        campaign.cost,
        campaign.budget,
        JSON.stringify(campaign.ip_pattern),
        JSON.stringify(campaign.white_list),
        JSON.stringify(campaign.black_list),
      ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error create new campaign]', err);
          resolve({
            error: 1,
            data: err.message,
          });
        }
        resolve({
          error: 0,
          data: results,
        });
      },
    );
  });
}

/**
 * Обновление ид оффера в кампании
 * @param offer_id 
 * @param id 
 */
export function updateOfferId(offer_id: number, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `campaigns` SET offer_id=?, updated=? WHERE id=?',
      [
        offer_id,
        new Date(),
        id,
      ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update offer_id for campaign]', err);
          resolve({
            error: 1,
            data: err.message,
          });
        }
        resolve({
          error: 0,
          data: results,
        });
      },
    );
  });
}

/**
 * Получение кампании по id
 * @param id 
 */
export function getById(id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'SELECT * FROM `campaigns` WHERE `id`=?',
      [ id ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error get campaign by id]', err);
          resolve({
            error: 1,
            data: err.message,
          });
        }
        resolve({
          error: 0,
          data: results,
        });
      },
    );
  });
}

/**
 * Обновление названия кампании
 * @param title 
 * @param id 
 */
export function updateTitle(title: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `campaigns` SET title=?, updated=? WHERE id=?',
      [
        title,
        new Date(),
        id,
      ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update campaign title]', err);
          resolve({
            error: 1,
            data: err.message,
          });
        }
        resolve({
          error: 0,
          data: results,
        });
      },
    );
  });
}

/**
 * Обновление ссылки кампании
 * @param link 
 * @param id 
 */
export function updateLink(link: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `campaigns` SET link=?, updated=? WHERE id=?',
      [
        link,
        new Date(),
        id,
      ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update campaign link]', err);
          resolve({
            error: 1,
            data: err.message,
          });
        }
        resolve({
          error: 0,
          data: results,
        });
      },
    );
  });
}

/**
 * Обновление постбек ссылки кампании
 * @param postback 
 * @param id 
 */
export function updatePostback(postback: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `campaigns` SET postback=?, updated=? WHERE id=?',
      [
        postback,
        new Date(),
        id,
      ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update campaign postback]', err);
          resolve({
            error: 1,
            data: err.message,
          });
        }
        resolve({
          error: 0,
          data: results,
        });
      },
    );
  });
}

/**
 * Обновление списка стран кампании
 * @param countries 
 * @param id 
 */
export function updateCountries(countries: string[], id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `campaigns` SET countries=?, updated=? WHERE id=?',
      [
        JSON.stringify(countries),
        new Date(),
        id,
      ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update campaign countries]', err);
          resolve({
            error: 1,
            data: err.message,
          });
        }
        resolve({
          error: 0,
          data: results,
        });
      },
    );
  });
}

/**
 * Обновление цены клика кампании
 * @param cost 
 * @param id 
 */
export function updateCost(cost: number, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `campaigns` SET cost=?, updated=? WHERE id=?',
      [
        cost,
        new Date(),
        id,
      ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update campaign cost]', err);
          resolve({
            error: 1,
            data: err.message,
          });
        }
        resolve({
          error: 0,
          data: results,
        });
      },
    );
  });
}

/**
 * Обновление бюджета кампании
 * @param budget 
 * @param id 
 */
export function updateBudget(budget: number, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `campaigns` SET budget=?, updated=? WHERE id=?',
      [
        budget,
        new Date(),
        id,
      ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update campaign budget]', err);
          resolve({
            error: 1,
            data: err.message,
          });
        }
        resolve({
          error: 0,
          data: results,
        });
      },
    );
  });
}

/**
 * Обновление IP паттерна кампании
 * @param ip_pattern 
 * @param id 
 */
export function updateIPPattern(ip_pattern: string[], id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `campaigns` SET ip_pattern=?, updated=? WHERE id=?',
      [
        JSON.stringify(ip_pattern),
        new Date(),
        id,
      ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update campaign IP pattern]', err);
          resolve({
            error: 1,
            data: err.message,
          });
        }
        resolve({
          error: 0,
          data: results,
        });
      },
    );
  });
}

/**
 * Обновление белого списка кампании
 * @param white_list 
 * @param id 
 */
export function updateWhitelist(white_list: string[], id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `campaigns` SET white_list=?, updated=? WHERE id=?',
      [
        JSON.stringify(white_list),
        new Date(),
        id,
      ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update campaign white list]', err);
          resolve({
            error: 1,
            data: err.message,
          });
        }
        resolve({
          error: 0,
          data: results,
        });
      },
    );
  });
}

/**
 * Обновление черного списка кампании
 * @param black_list 
 * @param id 
 */
export function updateBlacklist(black_list: string[], id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `campaigns` SET black_list=?, updated=? WHERE id=?',
      [
        JSON.stringify(black_list),
        new Date(),
        id,
      ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update campaign black list]', err);
          resolve({
            error: 1,
            data: err.message,
          });
        }
        resolve({
          error: 0,
          data: results,
        });
      },
    );
  });
}
