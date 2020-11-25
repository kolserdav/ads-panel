/**
 * Вспомогательные функции, которые не просто возвращают данные,
 * а ещё производят действия с ервисами или ресурсами.
 */

import * as Types from '../types';
import * as lib from '../lib';
import transporter from './transporter';

const {
  SMTP_EMAIL,
  LINK_EXPIRE,
  APP_ORIGIN,
}: any = process.env;
const dev = process.env.NODE_ENV === 'development';

function sendEmail(message: Types.Email, errMess: string): Promise<Types.OrmResult> {
  return new Promise(resolve => {
    transporter.sendMail(message)
      .then(data => {
        resolve({
          error: 0,
          data,
          message: 'Email sended',
        });
      })
      .catch(e => {
        console.error(`<${Date()}>`, `[${errMess}]`, e);
        resolve({
          error: 1,
          data: e.message,
          message: errMess,
        });
      });
  });
}


/**
 *  
 *  Отправка письма подтверждения адреса почты.
 *  dateNow должен соответствовать времени обновления данных пользователя в базе,
 *  так как по нему будет высчитываться ключ доступа. Для провекрки актуальности ссылки подтверждения.
 * 
 * @param email 
 * @param dateNow 
 * @param first_name 
 * @param host 
 */
export function getConfirmEmail(email: string, dateNow: number, first_name: string, host: string): Promise<Types.OrmResult> {

  const key = lib.encodeBase64(new Date(dateNow).toString());

  const newHost = dev ? host : APP_ORIGIN;
  const link = `${newHost}/confirm?e=${email}&k=${key}`;

  const userMessage: Types.Email = {
    from: SMTP_EMAIL,
    to: email,
    subject: 'Подтверждение адреса',
    text: `Здравствуйте ${first_name}! Ваш адрес почты был указан при регистрации на нашем сайте. Чтобы подтвердить данный адрес пожалуйста перейдите по следующей ссылке ${link},которая действительна в течении ${LINK_EXPIRE} дней.`,
    html: `Здравствуйте ${first_name}! Ваш адрес почты был указан при регистрации на нашем сайте. Чтобы подтвердить данный адрес пожалуйста перейдите по <a href="${link}">ссылке</a>, <i>которая действительна в течении ${LINK_EXPIRE} дней.</i>`,
  };

  return sendEmail(userMessage, 'Error send email to registered user');
}

export function getForgotEmail(email: string, dateNow: number, first_name: string, host: string): Promise<Types.OrmResult> {

  const key = lib.encodeBase64(new Date(dateNow).toString());

  const newHost = dev ? host : APP_ORIGIN;
  const link = `$${newHost}/forgot?e=${email}&k=${key}`;

  const userMessage = {
    from: SMTP_EMAIL,
    to: email,
    subject: 'Смена пароля',
    text: `Здравствуйте ${first_name}! Был инициирован процесс смены пароля, если это были вы, пожалуйста перейдите по следующей ссылке ${link},которая действительна в течении ${LINK_EXPIRE} дней.`,
    html: `Здравствуйте ${first_name}! Был инициирован процесс смены пароля, если это были вы, пожалуйста перейдите по <a href="${link}">ссылке</a>, <i>которая действительна в течении ${LINK_EXPIRE} дней.</i>`,
  };

  return sendEmail(userMessage, 'Error send email to forgot password user');
}
