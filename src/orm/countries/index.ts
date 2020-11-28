import * as Types from '../../types';
import * as lib from '../../lib';

/**
 * поиск страны по названию
 * @param search 
 */
export function searchCountries(search: string): Promise<Types.OrmResult> {
  const query = 'SELECT * FROM countries WHERE name LIKE ?';
  const values = [`${search}%`];
  return lib.runDBQuery(query, 'Error search country', values);
}
