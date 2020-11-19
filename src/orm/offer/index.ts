/**
 * Методы обращения к таблице offers
 * DEPRECATED - все методы, на данный момент работают и безопасно реализованы, но для 
 * дальнейшей более удобной разработки, нужно учесть опыт orm/statistic/index.ts см. orm/README.md
 */

import * as Types from '../../types';
import connection from '../connection';

/**
 * Создание нового оффера
 * @param offer 
 */
export function createNew(offer: Types.Offer): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'INSERT INTO `offers` (user_id, title, description) VALUES (?,?,?)',
      [
        offer.user_id,
        offer.title,
        offer.description,
      ],
      (err, results) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error create new offer]', err);
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
 * Получение оффера по id
 * @param id 
 */
export function getById(id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'SELECT * FROM `offers` WHERE `id`=?',
      [ id ],
      (err, results) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error get offer by id]', err);
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
 * Изменение иконки оффера
 * @param icon 
 * @param id 
 */
export function changeIcon(icon: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `offers` SET icon=?, updated=? WHERE `id`=?',
      [ icon, new Date(), id ],
      (err, results) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update offer icon]', err);
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
 * Изменение изображения оффера
 * @param image 
 * @param id 
 */
export function changeImage(image: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `offers` SET image=?, updated=? WHERE `id`=?',
      [ image, new Date(), id ],
      (err, results) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update offer image]', err);
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
 * Изменение названия оффера
 * @param title 
 * @param id 
 */
export function updateTitle(title: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `offers` SET title=?, updated=? WHERE `id`=?',
      [ title, new Date(), id ],
      (err, results) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update offer title]', err);
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
 * Изменение комментария оффера
 * @param description 
 * @param id 
 */
export function updateComment(description: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `offers` SET description=?, updated=? WHERE `id`=?',
      [ description, new Date(), id ],
      (err, results) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update offer description]', err);
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
 * Обновление статуса оффера
 * @param status 
 * @param id 
 */
export function updateStatus(status: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `offers` SET status=?, updated=? WHERE id=?',
      [
        status,
        new Date(),
        id,
      ],
      (err, results) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update offer status]', err);
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
 * Обновление сообщения предупреждения оффера
 * @param warning 
 * @param id 
 */
export function updateWarning(warning: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `offers` SET warning=?, updated=? WHERE id=?',
      [
        warning,
        new Date(),
        id,
      ],
      (err, results) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error update offer warning message]', err);
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
