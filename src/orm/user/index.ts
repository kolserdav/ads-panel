/**
 * Методы обращения к таблице users
 * DEPRECATED - все методы, на данный момент работают и безопасно реализованы, но для 
 * дальнейшей более удобной разработки, нужно учесть опыт orm/statistic/index.ts см. orm/README.md
 * однако это на любителя
 */
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
      (err, results) => {
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
      (err, results) => {
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
      (err, results) => {
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
      (err, results) => {
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
      (err, results) => {
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
      (err, results) => {
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

/**
 *  Смена имени
 * @param first_name 
 * @param id 
 */
export function changeFirstName(first_name: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `users` SET first_name=? WHERE id=?',
      [first_name, id],
      (err, results) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error change first_name]', err);
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
 *  Смена фамилии
 * @param last_name 
 * @param id 
 */
export function changeLastName(last_name: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `users` SET last_name=? WHERE id=?',
      [last_name, id],
      (err, results) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error change last_name]', err);
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
 *  Смена компании
 * @param company 
 * @param id 
 */
export function changeCompany(company: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `users` SET company=? WHERE id=?',
      [company, id],
      (err, results) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error change company]', err);
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
 *  Смена скайпа
 * @param company 
 * @param id 
 */
export function changeSkype(skype: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `users` SET skype=? WHERE id=?',
      [skype, id],
      (err, results) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error change skype]', err);
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
 * Смена email и постановка confirm d 0;
 * Внимание перед этим проверить, что email не занят! Так как метод не делает такой проверки.
 * @param email 
 * @param id 
 */
export function changeEmail(email: string, id: number): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'UPDATE `users` SET confirm=0, email=? WHERE id=?',
      [email, id],
      (err, results) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error change email]', err);
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
