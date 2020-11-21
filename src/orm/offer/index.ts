/**
 * Методы обращения к таблице offers
 */

const { MAX_DB_ID }: any = process.env;

import * as Types from '../../types';
import * as lib from '../../lib';

/**
 * Создание нового оффера
 * @param offer 
 */
export function createNew(offer: Types.Offer): Promise<Types.OrmResult> {
  const query = 'INSERT INTO `offers` (user_id, title, description) VALUES (?,?,?)';
  const values = [
    offer.user_id,
    offer.title,
    offer.description,
  ];
  return lib.runDBQuery(query, 'Error create new offer', values);
}

/**
 * Получение оффера по id
 * @param id 
 */
export function getById(id: number): Promise<Types.OrmResult> {
  const query = 'SELECT * FROM `offers` WHERE `id`=? AND archive=0';
  const values = [ id ];
  return lib.runDBQuery(query, 'Error get offer by id', values);
}

/**
 * ВНИМАНИЕ!!! - этот метод логически зависит от getCount если меняете его смотрите и там
 * Получение офферов
 * @param userId {number} - ид пользователя, если админу нужно по всем то -1
 * @param start {number} - первый элемент выборки
 * @param count {number} - второй элемент выборки
 */
export function getAll(userId: number, start: number, count: number): Promise<Types.OrmResult> {
  const first = start ? start : 0;
  const all = count ? count : parseInt(MAX_DB_ID, 10);
  const values = [
    first,
    all,
  ];
  let andWhere = '';
  // Если не админ или админ просит свои офферы
  if (userId !== -1) {
    andWhere = ' AND user_id=?';
    values.unshift(userId);
  }
  const query = `SELECT * FROM offers WHERE archive=0${andWhere} LIMIT ?,?`;
  return lib.runDBQuery(query, 'Error get offers', values);
}

/**
 * ВНИМАНИЕ!!! - этот метод логически зависит от getAll если меняете его смотрите и там
 * Подсчет количества для getAll()
 * @param userId {number} - ид пользователя, если админу нужно по всем то -1
 */
export function getCount(userId: number): Promise<any> {
  const values = [];
  let andWhere = '';
  // Если не админ или админ просит свои офферы
  if (userId !== -1) {
    andWhere = ' AND user_id=?';
    values.unshift(userId);
  }
  const query = `SELECT COUNT(id) as count FROM offers WHERE archive=0${andWhere} ORDER BY id`;
  return lib.runDBQuery(query, 'Error while count offers getting', values);
}

/**
 * Изменение иконки оффера
 * @param icon 
 * @param id 
 */
export function changeIcon(icon: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `offers` SET icon=?, updated=? WHERE `id`=?';
  const values = [ icon, new Date(), id ];
  return lib.runDBQuery(query, 'Error update offer icon', values);
}

/**
 * Изменение изображения оффера
 * @param image 
 * @param id 
 */
export function changeImage(image: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `offers` SET image=?, updated=? WHERE `id`=?';
  const values = [ image, new Date(), id ];
  return lib.runDBQuery(query, 'Error update offer image', values);
}

/**
 * Изменение названия оффера
 * @param title 
 * @param id 
 */
export function updateTitle(title: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `offers` SET title=?, updated=? WHERE `id`=?';
  const values = [ title, new Date(), id ];
  return lib.runDBQuery(query, 'Error update offer title', values);
}


/**
 * Изменение комментария оффера
 * @param description 
 * @param id 
 */
export function updateComment(description: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `offers` SET description=?, updated=? WHERE `id`=?';
  const values = [ description, new Date(), id ];
  return lib.runDBQuery(query, 'Error update offer description', values);
}

/**
 * Обновление статуса оффера
 * @param status 
 * @param id 
 */
export function updateStatus(status: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `offers` SET status=?, updated=? WHERE id=?';
  const values = [
    status,
    new Date(),
    id,
  ];
  return lib.runDBQuery(query, 'Error update offer status', values);
}

/**
 * Обновление сообщения предупреждения оффера
 * @param warning 
 * @param id 
 */
export function updateWarning(warning: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `offers` SET warning=?, updated=? WHERE id=?';
  const values = [
    warning,
    new Date(),
    id,
  ];
  return lib.runDBQuery(query, 'Error update offer warning message', values);
}

/**
 * Помещение оффера в архив
 * @param id 
 */
export function deleteOffer(id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE offers SET archive=1, updated=? WHERE id=?';
  const values = [
    new Date(),
    id,
  ];
  return lib.runDBQuery(query, 'Error update offer warning message', values);
}
