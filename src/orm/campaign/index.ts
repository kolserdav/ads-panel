import * as Types from '../../types';
import connection from '../connection';

/**
 * Создание новой кампании
 * @param campaign 
 */
export function createNew(campaign: Types.Campaign): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    connection.query(
      'INSERT INTO `campaigns` (user_id, title, link, postback, countries, cost, budget, ip_pattern, white_list, black_list) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [
        campaign.user_id,
        campaign.title,
        campaign.link,
        campaign.postback,
        JSON.stringify(campaign.countries),
        campaign.cost,
        campaign.budget,
        JSON.stringify(campaign.ip_pattern),
        JSON.stringify(campaign.white_list),
        JSON.stringify(campaign.black_list),
      ],
      (err, results, fields) => {
        if (err) {
          console.error(`<${Date()}>`, '[Error create new campaign]', err);
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
