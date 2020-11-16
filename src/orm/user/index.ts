import * as Types from '../../types';
import connection from '../connection';

/**
 *  Проверяет в базе пользователя по email
 * @param email {string}
 */
export function getByEmail(email: string): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'SELECT * FROM `users` WHERE `email`=?',
      [email],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error get user by email]', err);
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
 * Получение пользователя по id 
 * @param id 
 */
export function getById(id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'SELECT * FROM `users` WHERE `id`=?',
      [id],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error get user by id]', err);
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
 *  Вставляет в таблицу 'users' нового пользователя
 * 
 * @param user {Types.User}
 */
export function createNew(user: Types.User): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'INSERT INTO `users` (first_name, last_name, email, password, company, skype, updated) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        user.first_name,
        user.last_name,
        user.email,
        user.password,
        user.company,
        user.skype,
        user.updated,
      ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error create new user]', err);
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
 *  Устанавливает пользователю confirm в 1 вместо 0
 * @param id 
 */
export function confirm(id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `users` SET confirm=1, updated=? WHERE id=?',
      [new Date(), id],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error confirm email]', err);
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
 *  Обновляет updated пользователя по timestamp dateNow по которому сформирован ключ
 * @param dateNow 
 * @param id 
 */
export function changeUpdated(dateNow: number, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `users` SET updated=? WHERE id=?',
      [new Date(dateNow), id],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error change updated]', err);
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
 * Смена пароля
 * @param password 
 * @param id 
 */
export function changePassword(password: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `users` SET password=? WHERE id=?',
      [password, id],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error change password]', err);
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
