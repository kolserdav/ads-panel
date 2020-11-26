/**
 * Методы обращения к таблице users
 */
import * as Types from '../../types';
import * as lib from '../../lib';
import connection from '../connection';

/**
 *  Проверяет в базе пользователя по email
 * @param email {string}
 */
export function getByEmail(email: string): Promise<Types.OrmResult> {
  const query = 'SELECT * FROM `users` WHERE `email`=?';
  const values = [email];
  return lib.runDBQuery(query, 'Error get user by email', values);
}

/**
 * Получение пользователя по id 
 * @param id 
 */
export function getById(id: number): Promise<Types.OrmResult> {
  const query = 'SELECT * FROM `users` WHERE `id`=?';
  const values = [id];
  return lib.runDBQuery(query, 'Error get user by id', values);
}

/**
 *  Вставляет в таблицу 'users' нового пользователя
 * 
 * @param user {Types.User}
 */
export function createNew(user: Types.User): Promise<Types.OrmResult> {
  const query = 'INSERT INTO `users` (first_name, last_name, email, password, company, skype, updated) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [
    user.first_name,
    user.last_name,
    user.email,
    user.password,
    user.company,
    user.skype,
    user.updated,
  ];
  return lib.runDBQuery(query, 'Error create new user', values);
}

/**
 *  Устанавливает пользователю confirm в 1 вместо 0
 * @param id 
 */
export function confirm(id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `users` SET confirm=1, updated=? WHERE id=?';
  const values = [new Date(), id];
  return lib.runDBQuery(query, 'Error confirm email', values);
}


/**
 *  Обновляет updated пользователя по timestamp dateNow по которому сформирован ключ
 * @param dateNow 
 * @param id 
 */
export function changeUpdated(dateNow: number, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `users` SET updated=? WHERE id=?';
  const values = [new Date(dateNow), id];
  return lib.runDBQuery(query, 'Error change updated', values);
}

/**
 * Смена пароля
 * @param password 
 * @param id 
 */
export function changePassword(password: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `users` SET password=?, updated=? WHERE id=?';
  const values = [password, new Date(), id];
  return lib.runDBQuery(query, 'Error change password', values);
}

/**
 *  Смена имени
 * @param first_name 
 * @param id 
 */
export function changeFirstName(first_name: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `users` SET first_name=? WHERE id=?';
  const values = [first_name, id];
  return lib.runDBQuery(query, 'Error change first_name', values);
}

/**
 *  Смена фамилии
 * @param last_name 
 * @param id 
 */
export function changeLastName(last_name: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `users` SET last_name=? WHERE id=?';
  const values = [last_name, id];
  return lib.runDBQuery(query, 'Error change last_name', values);
}

/**
 *  Смена компании
 * @param company 
 * @param id 
 */
export function changeCompany(company: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `users` SET company=? WHERE id=?';
  const values = [company, id];
  return lib.runDBQuery(query, 'Error change company', values);
}

/**
 *  Смена скайпа
 * @param company 
 * @param id 
 */
export function changeSkype(skype: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `users` SET skype=? WHERE id=?';
  const values = [skype, id];
  return lib.runDBQuery(query, 'Error change skype', values);
}

/**
 * Смена email и постановка confirm d 0;
 * Внимание перед этим проверить, что email не занят! Так как метод не делает такой проверки.
 * @param email 
 * @param id 
 */
export function changeEmail(email: string, id: number): Promise<Types.OrmResult> {
  const query = 'UPDATE `users` SET confirm=0, email=? WHERE id=?';
  const values = [email, id];
  return lib.runDBQuery(query, 'Error change email', values);
}
