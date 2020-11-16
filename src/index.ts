import * as Types from './types';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

import * as router from './routes/index';
import * as middle from './middlewares';
import * as migrations from './orm/migrations';
import express from 'express';

// Если нужно удалить все таблицы, чтобы потом создать заново то true но ОСТОРОЖНО!!!
const dropTables = false;

const cTURes: Promise<Types.OrmResult> = migrations.createTableUsers(dropTables);


const { API_PORT }: any = process.env;

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));

app.get('/user', router.getUserByEmail);
app.post('/user', router.postCreateUser);
app.get('/user/confirm', router.getConfirm);
app.post('/user/login', router.postLogin);
app.put('/user', middle.auth, router.putUpdate);
app.get('/user/forgot', router.getForgot);
app.post('/user/forgot', router.postForgot);
app.put('/user/pass', router.putPass);

app.listen(parseInt(API_PORT, 10));
