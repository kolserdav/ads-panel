### Глобальные зависимости

## Для системы

_Версии указаны те на которых тестировалось_
```
yarn v^1.22.5
node.js v^12.16.3
screen v^4.01
```


#### Для NodeJs
Для запуска сервера на локальной машине с перезапуском после
nodemon 
```
npm i -g nodemon
```

Для компиляции тайпскрипта
typescript
```
npm i -g typescript
```

При желании поддерживать единый стиль кода
```
npm i -g eslint
```

### Установка

Загрузить из репозитория
```
git clone https://github.com/kolserdav/ads-panel AdsPanel
```
Установить зависимости
```
cd AdsPanel
yarn install
```
`Создать папку AdsPanel/public/img В данный момент автоматическое создание не предусмотрено`

### Запуск в режиме разработки

Запускаме еслинт(если нужен)
```
yarn eslint
```

Запускаем typescript компилятор
```
yarn ts
```

Запускаем сервер
```
yarn start
```

`В файле .vscode/settings.json настройки для Visual Studio Code чтобы подсвечило всё как у автора` 


### Запуск в режиме отладки на сервере

Собираем проект
```
yarn ts:build
```

Запускаем с консолью
```
yarn start:deploy
```

### Запуск в режиме продакшена

Собираем проект
```
yarn ts:build
```

Запускаем без консоли с выводом в лог
```
yarn prod
```

### Переменные среды

Указаны в файле .env

```ini
PASSWORD_MIN=6 # минимальная длина пароля
API_PORT=3001 # порт сервера
LINK_HOST=test.uyem.ru # хост для генерации ссылки в письме, указан напрямую, так как сервер может быть за балансировщиком и видеть req.headers['host'] как localhost
JWT_SECRET=fsdkjlk87987HKHJHKJlklkhd7879jlkhsld # секретный ключ шифрования веб токена
SMTP_HOST=smtp.gmail.com # сервер почты SMTP
SMTP_PORT=587 # порт ЫMTP почты
SMTP_EMAIL=uyem.ru@gmail.com # аккаунт SMTP
SMTP_PASS=vhhjhgoxftnqunmw # пароль SMTP
LINK_EXPIRE=3 # время жизни ссылок в почте
DB_HOST=localhost # хост базы данных
DB_NAME=ads_panel # название базы данных
DB_USER=telemaker # пользовать базы данных с правами на базу DB_NAME
DB_PASS=19Bpi3FLwvdguZ1d # пароль пользователя базы
MAX_DB_ID=18446744073709550000 # максималное значение количества результатов LIMIT если limit и current не переданы, для GET-ов
```

Для наполнения тестовыми данными смотреть `src/index.ts` и `src/orm/migrations/index.ts`.
src/index.ts
тут:
```javascript
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
```
_Сначала запускаем без создания, добавляем оффер и пару кампаний (так как тестовые данные привязаны к кампаниям), потом сколько нужно раз запускаем с созданием. По удалениютаблиц, в настоящее время не актуально, так как это только для промежуточных изменений в миграциях, да и ключи не дадут._

### _Приятной работы!_