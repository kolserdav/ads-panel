// Роуты пользователя
export { default as getUserByEmail } from './user/get.userByEmail';
export { default as postCreateUser } from './user/post.createUser';
export { default as getConfirm } from './user/get.confirm';
export { default as postLogin } from './user/post.login';
export { default as putUpdate } from './user/put.update';
export { default as getForgot } from './user/get.forgot';
export { default as postForgot } from './user/post.forgot';
export { default as putPass } from './user/put.pass';
export { default as getSession } from './user/get.session';
// Роуты кампаний
export { default as postCreateCampaign } from './campaign/post.create';
export { default as putUpdateCampaign } from './campaign/put.update';
export { default as putStatusCampaign } from './campaign/put.status';
export { default as getCampaign } from './campaign/get.campaign';
export { default as getCampaigns } from './campaign/get.campaigns';
// Роуты офферов
export { default as postCreateOffer } from './offer/post.create';
export { default as postImageOffer } from './offer/post.image';
export { default as postIconOffer } from './offer/post.icon';
export { default as putUpdateOffer } from './offer/put.update';
export { default as putStatusOffer } from './offer/put.status';
// Роуты статистики
export { default as getTableStatistic } from './statistic/get.table';
export { default as getGraphStatistic } from './statistic/get.graph';
