import * as Types from './types';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
import * as lib from './lib';
import * as middle from './middlewares';
import * as migrations from './orm/migrations';
import * as router from './routes/index';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import cors from 'cors';

// Отлавливаем тут всё что случайно не отловили где-то там, чтобы если упало то не всё.
process.on('unhandledRejection', (e: Error) => {
  console.error(`<${Date()}>`, '["UNHANDLED_REJECTION_TASK"]', e);
});
process.on('uncaughtException', (e: Error) => {
  console.error(`<${Date()}>`, '["UNCAUGT_EXCEPTION_TASK"]', e);
});

// Хранилище изображений
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb) => {
    const reg = /^image\//;
    if (!reg.exec(file.mimetype)) {
      // @ts-ignore
      return cb(new Error('Ошибка! Можно передавать только изображения.').message, '');
    }
    const dir = req.params.id;
    req.imageDir = dir;
    const dirPath = path.resolve(__dirname, `../public/img/offers/${dir}`);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    cb(null, `public/img/offers/${dir}`);
  },
  filename: (req: any, file, cb) => {
    req.imageFile = file;
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });


// Если нужно удалить все таблицы, чтобы потом создать заново то true но ОСТОРОЖНО!!!
const dropTables = false;
// Для наполения тестовыми данными true
const testData = false;

// Создает нужные таблицы.
console.info(`<${Date()}>`, 'Start create tables script ...');
void Promise.all([
  migrations.createTableUsers(dropTables),
  migrations.createTableOffers(dropTables),
  migrations.createTableCampaigns(dropTables),
  migrations.createTableCountries(dropTables),
  migrations.createTableHourly(dropTables),
  migrations.createTableDayly(dropTables),
  migrations.createTableTransactions(dropTables),
  testData ? migrations.insertTestdataInHourly() : () => {/** */},
  testData ? migrations.insertTestdataInDayly() : () => {/** */},
])
  .then(data => {
    let errors = 0;
    data.map(item => {
      if (item.error === 1) {
        errors++;
      }
    });
    console.info(`<${Date()}>`, 'Table create results', data, `Creating ${data.length} tables ended with ${errors} errors.`);
  })
  .catch(e => {
    console.error(`<${Date()}>`, 'Error create table', e);
  });

const { API_PORT, APP_ORIGIN }: any = process.env;

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: APP_ORIGIN }));

// Выдает статичные изображения
app.use('/img', express.static(path.resolve(__dirname, '../public/img')));

// API пользователя
app.get('/user', router.getUserByEmail);
app.post('/user', router.postCreateUser);
app.get('/user/confirm', router.getConfirm);
app.post('/user/login', router.postLogin);
app.put('/user', middle.auth, router.putUpdate);
app.get('/user/forgot', router.getForgot);
app.post('/user/forgot', router.postForgot);
app.put('/user/pass', router.putPass);
app.get('/user/session', middle.auth, router.getSession);
// API кампаний
app.post('/campaign', middle.auth, router.postCreateCampaign);
app.put('/campaign/:id', middle.auth, middle.selfCampaign, router.putUpdateCampaign);
app.put('/campaign/status/:id', middle.auth, middle.onlyAdmin, router.putStatusCampaign);
app.get('/campaign/:id', middle.auth, middle.orAdmin, middle.selfCampaign, router.getCampaign);
app.delete('/campaign/:id', middle.auth, middle.selfCampaign, router.deleteCampaign);
app.get('/campaign', middle.auth, router.getCampaigns);
// API офферов
app.post('/offer', middle.auth, router.postCreateOffer);
app.post('/offer/icon/:id', middle.auth, middle.selfOffer, upload.single('icon'), router.postIconOffer);
app.post('/offer/image/:id', middle.auth, middle.selfOffer, upload.single('image'), router.postImageOffer);
app.put('/offer/:id', middle.auth, middle.selfOffer, router.putUpdateOffer);
app.put('/offer/status/:id', middle.auth, middle.onlyAdmin, router.putStatusOffer);
app.get('/offer/:id', middle.auth, middle.orAdmin, middle.selfOffer, router.getOffer);
app.get('/offer', middle.auth, router.getOffers);
app.delete('/offer/:id', middle.auth, middle.selfOffer, router.deleteOffer);
// API статистики
app.get('/statistic/table', middle.auth, router.getTableStatistic);
app.post('/statistic/graph', middle.auth, router.getGraphStatistic);
// Транзакции
app.post('/transaction', middle.auth, router.postCreateTransaction);
app.get('/transaction', middle.auth, router.getTransactions);


app.listen(parseInt(API_PORT, 10), () => {
  console.info(`\nListen on http://localhost:${API_PORT}\n`);
});
