import * as Types from '../types';
import * as lib from '../lib';
import transporter from './transporter';

const {
  SMTP_EMAIL,
  LINK_EXPIRE,
}: any = process.env;
const dev = process.env.NODE_ENV === 'development';
const protocol = dev ? 'http' : 'https';
const remoteHost = 'test.uyem.ru';


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

  const newHost = dev ? host : remoteHost;
  const link = `${protocol}://${newHost}/user/confirm?e=${email}&k=${key}`;

  const userMessage = {
    from: SMTP_EMAIL,
    to: email,
    subject: 'Подтверждение адреса',
    text: `Здравствуйте ${first_name}! Ваш адрес почты был указан при регистрации на нашем сайте. Чтобы подтвердить данный адрес пожалуйста перейдите по следующей ссылке ${link},которая действительна в течении ${LINK_EXPIRE} дней.`,
    html: `Здравствуйте ${first_name}! Ваш адрес почты был указан при регистрации на нашем сайте. Чтобы подтвердить данный адрес пожалуйста перейдите по <a href="${link}">ссылке</a>, <i>которая действительна в течении ${LINK_EXPIRE} дней.</i>`,
  };

  return new Promise(resolve => {
    transporter.sendMail(userMessage)
      .then(data => {
        resolve({
          error: 0,
          data,
        });
      })
      .catch(e => {
        console.error(`<${Date()}>`, '[Error send email to registered user]', e);
        resolve({
          error: 1,
          data: e.message,
        });
      });
  });
}

export function getForgotEmail(email: string, dateNow: number, first_name: string, host: string): Promise<Types.OrmResult> {

  const key = lib.encodeBase64(new Date(dateNow).toString());

  const newHost = dev ? host : remoteHost;
  const link = `${protocol}://${newHost}/user/forgot?e=${email}&k=${key}`;

  const userMessage = {
    from: SMTP_EMAIL,
    to: email,
    subject: 'Смена пароля',
    text: `Здравствуйте ${first_name}! Был инициирован процесс смены пароля, если это были вы, пожалуйста перейдите по следующей ссылке ${link},которая действительна в течении ${LINK_EXPIRE} дней.`,
    html: `Здравствуйте ${first_name}! Был инициирован процесс смены пароля, если это были вы, пожалуйста перейдите по <a href="${link}">ссылке</a>, <i>которая действительна в течении ${LINK_EXPIRE} дней.</i>`,
  };

  return new Promise(resolve => {
    transporter.sendMail(userMessage)
      .then(data => {
        resolve({
          error: 0,
          data,
        });
      })
      .catch(e => {
        console.error(`<${Date()}>`, '[Error send email to forgot password user]', e);
        resolve({
          error: 1,
          data: e.message,
        });
      });
  });
}
