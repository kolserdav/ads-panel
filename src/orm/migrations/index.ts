import connection from '../connection';
import Types from '../../types';
import countries from '../../scripts/countries';

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
    status ENUM(\'active\', \'pause\', \'pending\', \'budget\') NOT NULL DEFAULT \'pending\',\
    link VARCHAR(255),\
    postback VARCHAR(255),\
    countries JSON,\
    cost FLOAT(8, 2) UNSIGNED DEFAULT NULL,\
    user_id INT NOT NULL,\
    offer_id INT NULL,\
    budget FLOAT(8, 2) UNSIGNED DEFAULT NULL,\
    ip_pattern JSON,\
    white_list JSON,\
    black_list JSON,\
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    PRIMARY KEY (id),\
    FOREIGN KEY (user_id) REFERENCES users (id),\
    FOREIGN KEY (offer_id) REFERENCES offers (id),\
    KEY orderby (status)\
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
    description VARCHAR(255),\
    status ENUM(\'verified\', \'pending\', \'warning\') DEFAULT \'pending\',\
    warning TEXT NULL,\
    icon VARCHAR(255),\
    image VARCHAR(255),\
    user_id INT NOT NULL,\
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    PRIMARY KEY (id),\
    FOREIGN KEY (user_id) REFERENCES users (id)\
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

/**
 * Создание таблицы countries
 * @param needDelete 
 */
export function createTableCountries(needDelete = false): Promise<Types.OrmResult> {

  const createQuery = 'CREATE TABLE IF NOT EXISTS `countries` (\
    id INT NOT NULL AUTO_INCREMENT,\
    code CHAR(2) UNIQUE,\
    name VARCHAR(255),\
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    PRIMARY KEY (id)\
    )';
  const deleteQuery = 'DROP TABLE `countries`';
  const query = needDelete ? deleteQuery : createQuery;
  return new Promise(resolve => {
    connection.query(query, (err, result) => {
      if (err) {
        console.error(`<${Date()}>`, '[Error create table "counries"]', err);
        resolve({
          error: 1,
          data: err.message,
        });
      } else {
        const ctrs: any = countries;
        // Наполнение странами
        for (const prop in ctrs.countries) {
          connection.query('INSERT INTO `countries` (code, name) VALUES (?,?)',
            [
              prop,
              ctrs.countries[prop],
            ], (error, res) => {
              if (error) {
                // Не показывает ошибки дублирования ключей в таблице стран
                if (error.errno !== 1062) {
                  console.error(`<${Date()}>`, '[Error insert values in table "countries"]', error);
                }
              }
              if (prop === 'ZW') {
                resolve({
                  error: 0,
                  data: res,
                });
              }
            },
          );
        }
      }
    });
  });
}

/**
 * Создание таблицы hourly
 * @param needDelete 
 */
export function createTableHourly(needDelete = false): Promise<Types.OrmResult> {

  const createQuery = 'CREATE TABLE IF NOT EXISTS hourly (\
    id INT NOT NULL AUTO_INCREMENT,\
    date DATETIME NOT NULL,\
    campaign INT NOT NULL,\
    subid VARCHAR(256) DEFAULT NULL,\
    country CHAR(2) DEFAULT NULL,\
    requests INT(10) UNSIGNED DEFAULT NULL,\
    impressions INT(10) UNSIGNED DEFAULT NULL,\
    clicks INT(10) UNSIGNED DEFAULT NULL,\
    cost FLOAT(8,4) UNSIGNED DEFAULT NULL,\
    PRIMARY KEY (id),\
    FOREIGN KEY (campaign) REFERENCES campaigns (id),\
    KEY groupby (date, subid, country, campaign)\
) ENGINE=InnoDB DEFAULT CHARSET=latin1;';
  const deleteQuery = 'DROP TABLE `hourly`';
  const query = needDelete ? deleteQuery : createQuery;
  return new Promise(resolve => {
    connection.query(query, (err, result) => {
      if (err) {
        console.error(`<${Date()}>`, '[Error create table "hourly"]', err);
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
 * Создание таблицы dayly
 * @param needDelete 
 */
export function createTableDayly(needDelete = false): Promise<Types.OrmResult> {

  const createQuery = 'CREATE TABLE IF NOT EXISTS daily (\
    id INT NOT NULL AUTO_INCREMENT,\
    date DATETIME NOT NULL,\
    campaign INT NOT NULL,\
    subid VARCHAR(256) DEFAULT NULL,\
    country CHAR(2) DEFAULT NULL,\
    requests INT(10) UNSIGNED DEFAULT NULL,\
    impressions INT(10) UNSIGNED DEFAULT NULL,\
    clicks INT(10) UNSIGNED DEFAULT NULL,\
    cost float(8,4) UNSIGNED DEFAULT NULL,\
    PRIMARY KEY (id),\
    FOREIGN KEY (campaign) REFERENCES campaigns (id),\
    KEY groupby (date, subid, country, campaign)\
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1;';
  const deleteQuery = 'DROP TABLE `dayly`';
  const query = needDelete ? deleteQuery : createQuery;
  return new Promise(resolve => {
    connection.query(query, (err, result) => {
      if (err) {
        console.error(`<${Date()}>`, '[Error create table "daily"]', err);
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
 * Вставляет тестовые данные в hourly
 * @param needDelete 
 */
export async function insertTestdataInHourly(): Promise<any> {
  for (const prop in countries.countries) {
    const res: Types.OrmResult = await new Promise(resolve => {
      const date = new Date();
      date.setDate(date.getDate() - parseInt((Math.random() * 30).toFixed(0), 10));
      connection.query('INSERT INTO hourly (date, campaign, subid, country, requests, impressions, clicks, cost) VALUES (?,?,?,?,?,?,?,?)',
        [
          date,
          parseInt((Math.random() * 2).toFixed(0), 10) || 1,
          `${prop}-subid`,
          prop,
          parseInt((Math.random() * 50).toFixed(0), 10),
          parseInt((Math.random() * 100).toFixed(0), 10),
          parseInt((Math.random() * 20).toFixed(0), 10),
          parseInt((Math.random() * 10).toFixed(2), 10),
        ], (err, result) => {
          if (err) {
            console.error(`<${Date()}>`, '[Error insert test data in "hourly"]', err);
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
    if (res.error === 1) {
      break;
    }
  }
}

/**
 * Вставляет тестовые данные в hourly
 * @param needDelete 
 */
export async function insertTestdataInDayly(): Promise<any> {
  for (const prop in countries.countries) {
    const res: Types.OrmResult = await new Promise(resolve => {
      const date = new Date();
      date.setDate(date.getDate() - parseInt((Math.random() * 400).toFixed(0), 10));
      connection.query('INSERT INTO daily (date, campaign, subid, country, requests, impressions, clicks, cost) VALUES (?,?,?,?,?,?,?,?)',
        [
          date,
          parseInt((Math.random() * 2).toFixed(0), 10) || 1,
          `${prop}-subid`,
          prop,
          parseInt((Math.random() * 50).toFixed(0), 10),
          parseInt((Math.random() * 100).toFixed(0), 10),
          parseInt((Math.random() * 20).toFixed(0), 10),
          parseInt((Math.random() * 10).toFixed(2), 10),
        ], (err, result) => {
          if (err) {
            console.error(`<${Date()}>`, '[Error insert test data in "daily"]', err);
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
    if (res.error === 1) {
      break;
    }
  }
}
