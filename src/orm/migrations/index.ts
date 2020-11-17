import connection from '../connection';
import Types from '../../types';


/**
 * Создает таблицу users, если needDelete = true то удаляет её
 * @param needDelete 
 */

export function createTableUsers(needDelete = false): Promise<Types.OrmResult> {

  const createQuery = 'CREATE TABLE IF NOT EXISTS `users` (\
    id INT NOT NULL AUTO_INCREMENT,\
    admin BOOLEAN DEFAULT FALSE,\
    confirm BOOLEAN DEFAULT FALSE,\
    first_name VARCHAR(25),\
    last_name VARCHAR(25),\
    email VARCHAR(50),\
    company VARCHAR(255),\
    skype VARCHAR(25),\
    password VARCHAR(255),\
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    PRIMARY KEY (id)\
    )';
  const deleteQuery = 'DROP TABLE `users`';
  const query = needDelete ? deleteQuery : createQuery;
  return new Promise(resolve => {
    connection.query(query, (err, result) => {
      if (err) {
        console.error(`<${Date()}>`, '[Error create table "users"]', err);
        resolve({
          error: 1,
          data: err.message,
        });
      } else {
        resolve({
          error: 0,
          data: result,
        });
      }
    });
  });
}

/**
 * Создание таблицы campaigns
 * @param needDelete 
 */
export function createTableCampaigns(needDelete = false): Promise<Types.OrmResult> {

  const createQuery = 'CREATE TABLE IF NOT EXISTS `campaigns` (\
    id INT NOT NULL AUTO_INCREMENT,\
    title VARCHAR(255),\
    link VARCHAR(255),\
    postback VARCHAR(255),\
    countries JSON,\
    cost FLOAT(7, 2),\
    user_id INT NOT NULL,\
    offer_id INT NULL,\
    budget FLOAT(7, 2),\
    ip_pattern JSON,\
    white_list JSON,\
    black_list JSON,\
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    PRIMARY KEY (id),\
    FOREIGN KEY (user_id) REFERENCES users (id),\
    FOREIGN KEY (offer_id) REFERENCES offers (id)\
    )';
  const deleteQuery = 'DROP TABLE `campaigns`';
  const query = needDelete ? deleteQuery : createQuery;
  return new Promise(resolve => {
    connection.query(query, (err, result) => {
      if (err) {
        console.error(`<${Date()}>`, '[Error create table "campaigns"]', err);
        resolve({
          error: 1,
          data: err.message,
        });
      } else {
        resolve({
          error: 0,
          data: result,
        });
      }
    });
  });
}

/**
 * Создание таблицы offers
 * @param needDelete 
 */
export function createTableOffers(needDelete = false): Promise<Types.OrmResult> {

  const createQuery = 'CREATE TABLE IF NOT EXISTS `offers` (\
    id INT NOT NULL AUTO_INCREMENT,\
    title VARCHAR(255),\
    comment JSON,\
    icon VARCHAR(255),\
    image VARCHAR(255),\
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    PRIMARY KEY (id)\
    )';
  const deleteQuery = 'DROP TABLE `offers`';
  const query = needDelete ? deleteQuery : createQuery;
  return new Promise(resolve => {
    connection.query(query, (err, result) => {
      if (err) {
        console.error(`<${Date()}>`, '[Error create table "offers"]', err);
        resolve({
          error: 1,
          data: err.message,
        });
      } else {
        resolve({
          error: 0,
          data: result,
        });
      }
    });
  });
}
