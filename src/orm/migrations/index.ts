import * as Types from '../../types';
import * as lib from '../../lib';
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
    balance FLOAT(8, 2),\
    password VARCHAR(255),\
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    PRIMARY KEY (id)\
    )';
  const deleteQuery = 'DROP TABLE `users`';
  const query = needDelete ? deleteQuery : createQuery;
  return lib.runDBQuery(query, 'Error create table "users"');
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
    countries JSON,\
    price FLOAT(8, 2) UNSIGNED DEFAULT NULL,\
    user_id INT NOT NULL,\
    offer_id INT NULL,\
    budget FLOAT(8, 2) UNSIGNED DEFAULT NULL,\
    ip_pattern JSON,\
    white_list JSON,\
    black_list JSON,\
    archive BOOLEAN DEFAULT FALSE,\
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    PRIMARY KEY (id),\
    FOREIGN KEY (user_id) REFERENCES users (id),\
    FOREIGN KEY (offer_id) REFERENCES offers (id),\
    KEY orderby (status)\
    )';
  const deleteQuery = 'DROP TABLE `campaigns`';
  const query = needDelete ? deleteQuery : createQuery;
  return lib.runDBQuery(query, 'Error create table "campaigns"');
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
  return lib.runDBQuery(query, 'Error create table "offers"');
}

/**
 * Создание таблицы countries
 * @param needDelete 
 */
export async function createTableCountries(needDelete = false): Promise<Types.OrmResult> {

  const createQuery = 'CREATE TABLE IF NOT EXISTS `countries` (\
    id INT NOT NULL AUTO_INCREMENT,\
    code CHAR(2) UNIQUE,\
    name VARCHAR(255),\
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    PRIMARY KEY (id)\
    )';
  const deleteQuery = 'DROP TABLE `countries`';
  const query = needDelete ? deleteQuery : createQuery;
  const createRes = await lib.runDBQuery(query, 'Error create table "counries"');
  if (createRes.error === 1) {
    return createRes;
  }
  if (createRes.data.warningStatus !== 1) {
    const ctrs: any = countries;
    // Наполнение странами
    const dinQuery = 'INSERT INTO `countries` (code, name) VALUES (?,?)';
    for (const prop in ctrs.countries) {
      const values = [
        prop,
        ctrs.countries[prop],
      ];
      await lib.runDBQuery(dinQuery, 'Error insert values in table "countries"', values);
    }
  }
  return {
    error: 0,
    data: 'success',
    message: 'All values inserted into countries',
  };
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
    KEY groupby (date, subid, country, campaign),\
    KEY orderby (date, subid, country, campaign, requests, impressions, clicks, cost),\
    KEY date (date)\
) ENGINE=InnoDB DEFAULT CHARSET=latin1;';
  const deleteQuery = 'DROP TABLE `hourly`';
  const query = needDelete ? deleteQuery : createQuery;
  return lib.runDBQuery(query, 'Error create table "hourly"');
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
    KEY groupby (date, subid, country, campaign),\
    KEY orderby (date, subid, country, campaign, requests, impressions, clicks, cost),\
    KEY date (date)\
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1;';
  const deleteQuery = 'DROP TABLE `dayly`';
  const query = needDelete ? deleteQuery : createQuery;
  return lib.runDBQuery(query, 'Error create table "daily"');
}

/**
 * Создание таблицы transactions
 * @param needDelete 
 */
export function createTableTransactions(needDelete = false): Promise<Types.OrmResult> {

  const createQuery = 'CREATE TABLE IF NOT EXISTS transactions (\
    id INT NOT NULL AUTO_INCREMENT,\
    date DATETIME NOT NULL,\
    user_id INT NOT NULL,\
    amount FLOAT(8, 2) UNSIGNED DEFAULT NULL,\
    comment TEXT DEFAULT NULL,\
    PRIMARY KEY (id),\
    FOREIGN KEY (user_id) REFERENCES users (id),\
    KEY date (date),\
    KEY user_id (user_id)\
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1;';
  const deleteQuery = 'DROP TABLE `transactions`';
  const query = needDelete ? deleteQuery : createQuery;
  return lib.runDBQuery(query, 'Error create table "transactions"');
}

/**
 * Вставляет тестовые данные в hourly
 * @param needDelete 
 */
export async function insertTestdataInHourly(): Promise<Types.OrmResult> {
  console.info(`<${Date()}>`, 'Start inserting test data into hourly');
  for (const prop in countries.countries) {
    const date = new Date();
    date.setDate(date.getDate() - parseInt((Math.random() * 30).toFixed(0), 10));
    const query = 'INSERT INTO hourly (date, campaign, subid, country, requests, impressions, clicks, cost) VALUES (?,?,?,?,?,?,?,?)';
    const values = [
      date,
      parseInt((Math.random() * 2).toFixed(0), 10) || 1,
      `${prop}-subid`,
      prop,
      parseInt((Math.random() * 50).toFixed(0), 10),
      parseInt((Math.random() * 100).toFixed(0), 10),
      parseInt((Math.random() * 20).toFixed(0), 10),
      parseInt((Math.random() * 10).toFixed(2), 10),
    ];
    await lib.runDBQuery(query, 'Error insert test data in "hourly"', values);
  }
  return {
    error: 0,
    data: 'success',
    message: 'All testings values inserted into hourly',
  };
}

/**
 * Вставляет тестовые данные в hourly
 * @param needDelete 
 */
export async function insertTestdataInDayly(): Promise<any> {
  console.info(`<${Date()}>`, 'Start inserting test data into daily');
  for (const prop in countries.countries) {
    const date = new Date();
    date.setDate(date.getDate() - parseInt((Math.random() * 400).toFixed(0), 10));
    const query = 'INSERT INTO daily (date, campaign, subid, country, requests, impressions, clicks, cost) VALUES (?,?,?,?,?,?,?,?)';
    const values = [
      date,
      parseInt((Math.random() * 2).toFixed(0), 10) || 1,
      `${prop}-subid`,
      prop,
      parseInt((Math.random() * 50).toFixed(0), 10),
      parseInt((Math.random() * 100).toFixed(0), 10),
      parseInt((Math.random() * 20).toFixed(0), 10),
      parseInt((Math.random() * 10).toFixed(2), 10),
    ];
    await lib.runDBQuery(query, 'Error insert test data in "daily"', values);
  }
  return {
    error: 0,
    data: 'success',
    message: 'All testings values inserted into daily',
  };
}
