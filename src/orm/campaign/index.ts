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

/**
 * Обновление статуса
 * @param status 
 * @param id 
 */
export function updateStatus(status: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `campaigns` SET status=?, updated=? WHERE id=?',
      [
        status,
        new Date(),
        id,
      ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update campaign status]', err);
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

export function getAll(status: string): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'SELECT * FROM ORDER BY CASE WHEN status=? THEN 1 ELSE 2 END `campaigns`',
      [ status ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error get all campaigns]', err);
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

export function getAllByUid(status: string, user_id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'SELECT * FROM `campaigns` WHERE user_id=? ORDER BY CASE WHEN status=? THEN 1 ELSE 2 END',
      [ user_id, status ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error get all you campaigns]', err);
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
 * Фильтрует пагинацию с учетом user_id
 * @param user_id 
 * @param start - первый элемент
 * @param count - количество элементов
 */
export function filterAllByUid(user_id: number, status: string, start: number, count: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'SELECT * FROM `campaigns` WHERE user_id=? ORDER BY CASE WHEN status=? THEN 1 ELSE 2 END LIMIT ?,?',
      [ user_id, status, start, count ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error get list of your campaigns]', err);
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
 * Фильтрует пагинацию среди всех кампаний
 * @param start - первый элемент
 * @param count - количество элементов
 */
export function filterAll(status: string, start: number, count: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'SELECT * FROM `campaigns` ORDER BY CASE WHEN status=? THEN 1 ELSE 2 END LIMIT ?,? ',
      [ status, start, count ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error get list of campaigns]', err);
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
 * Получает общее количество кампаний
 */
export function getCountAll(): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'SELECT COUNT(*) FROM `campaigns`',
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error get all count campaigns]', err);
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
 * Получает общее количество кампаний с учетом user_id
 * @param user_id 
 */
export function getCountByUid(user_id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'SELECT COUNT(*) FROM `campaigns` WHERE user_id=?',
      [ user_id ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error get user count campaigns]', err);
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
