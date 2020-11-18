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
    const dirPath = path.resolve(__dirname, `../public/img/${dir}`);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    cb(null, `public/img/${dir}`);
  },
  filename: (req: any, file, cb) => {
    req.imageFile = file;
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });


// Если нужно удалить все таблицы, чтобы потом создать заново то true но ОСТОРОЖНО!!!
const dropTables = false;

const cTURes: Promise<Types.OrmResult> = migrations.createTableUsers(dropTables);
const cTORes: Promise<Types.OrmResult> = migrations.createTableOffers(dropTables);
const cTCRes: Promise<Types.OrmResult> = migrations.createTableCampaigns(dropTables);
const cTCounries: Promise<Types.OrmResult> = migrations.createTableCountries(dropTables);


const { API_PORT }: any = process.env;

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

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
app.get('/campaign', middle.auth, router.getCampaigns);
// API офферов
app.post('/offer', middle.auth, router.postCreateOffer);
app.post('/offer/icon/:id', middle.auth, middle.selfOffer, upload.single('icon'), router.postIconOffer);
app.post('/offer/image/:id', middle.auth, middle.selfOffer, upload.single('image'), router.postImageOffer);
app.put('/offer/:id', middle.auth, middle.selfOffer, router.putUpdateOffer);
app.put('/offer/status/:id', middle.auth, middle.onlyAdmin, router.putStatusOffer);


app.listen(parseInt(API_PORT, 10));
