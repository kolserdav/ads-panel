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
