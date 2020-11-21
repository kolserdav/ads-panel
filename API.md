## Документация API вызовов

### Статичные изображения

#### Изображения офферов
Основные и и иконки:

    `/img/offers/{offer_id}/{image_name} GET` возвращает статичное изображение

### Вызовы по данным пользователя 

`/user GET` - Обработчик вызова в результате отвечает success если почта доступна для регистрации

    email — {string} - почта которую нужно проверить

`/user POST` - Регистрация пользователя.

    email — {string} - почта
    first_name — {string} - имя
    last_name — {string} - фамилия
    password — {string} - пароль
    password_repeat — {string} - повтор пароля
    company — {string} - компания
    skype {string} - скайп

`/user/confirm GET` - Подтверждение почты Ожидает QueryString e=email и k=key Которые сформированы из ссылки отправленой при регистрации

    e — {string} - почта
    k — {string} - ключ

`/user/login POST` - Апи входа. Ожидвет email и password в результате возвращает токен. Который в закрытых узлах ожидается в заголовке xx-auth.

    email — {string} - почта
    password — {string} - пароль

`/user PUT` - Изменение данных пользователя. Открыто только для пользователя с токеном переданным в заголовке xx-auth ID пользователя сервер берет из токена расшифровывая его секретным ключом из .env - JWT_SECRET.

    email — {string} - почта
    first_name — {string} - имя
    last_name — {string} - фамилия
    company — {string} - компания
    skype — {string} - скайп
    sendConfirm — {1|0} - если нужно просто отправить ссылку на подтверждение

`/user/forgot GET` - Запрос токена смены пароля Ожидает QueryString e=email и k=key Которые сформированы из ссылки отправленой при запросе смены пароля
Внимание с одним key генерация токена смены пароля сработает только один раз, для повторной генерации нового токена нужно передавать полученный токен вместо key. Полученный здесь токен смены пароля работает в смене пароля по PUT /user/pass

    e — {string} - почта
    k — {string} - ключ

`/user/forgot POST` - Запрос на смену пароля . Передаётся почта в email, создается и отправляется ключ, который при переходе на GET /user/forgot проверяет ключ и генерирует токен на смену пароля.

    email — {string} - почта

`/user/pass PUT` - Смена пароля Ожидает заголовок xx-token сформированный через POST /user/forgot - при переходе по ссылке из письма или обновленный, через GET /user/forgot. Также обязательно передаем email, password, password_repeat

    password — {string}
    password_repeat — {string}
    email — {string}

`/user/session GET` - Возвращает данные пользователя. Защищен посредником auth.


### Вызовы по данным кампаний

`/campaign POST` -  Создание кампании.

    title — {string} - Название
    link — {string} - Ссылка
    countries — {string[]} - Список кодов стран
    price — {number} - Цена клика
    budget — {number} - Бюджет
    ip_pattern — {string[]} - Список ip адресов
    white_list — {string[]} - Черный список
    black_list — {string[]} - Белый список
    offer_id — {number} - ID оффера

`/campaign/:id PUT` - Обновление данных кампании. Можно менять по одному или все вместе.

    title — {string}
    link — {string}
    countries — {string[]}
    price — {string[]}
    budget — {number}
    ip_pattern — {string[]}
    white_list — {string[]}
    black_list — {string[]}
    offer_id {number}

`/campaign/status PUT` Изменение статуса кампании. Скрыто за посредниками auth, и onlyAdmin

    status — {Types.CampaignStatus} - статус

`/campaign/:id GET` - Получение кампании по id. Имеет доступ только создатель и админы. Благодаря посредникам selfCampaign и orAdmin.

`/campaign GET` - Получение кампаний по фильтрам. Имеет доступ только авторизованный, но без посредников selfCampaign и orAdmin, так как нужна непосредственная выборка на роуте. Принимает 3 body аргумента.

    self — - это для админа, если он хочет получить только свои кампании self=1 иначе он видит все кампании.
    current — - текущая страница
    limit — - количество на странице
    status — - сортировка по статусу

`/campaign DELETE` Удаление кампании. Помечает кампании archive=0

### Вызовы по данным офферов

`/offer POST` - Создание нового оффера. Ид пользователя берет из токена при аутентификации вызова. Принимает 'title', 'comment'.

    title — {string} - название
    description — {string} - описание

`/offer/icon/:id POST` - Изменяет иконку оффера. Ожидает передаваемую иконку в multipart. Название FormData объекта 'icon'.

    icon {FormData}

`/offer/image/:id POST` - Изменяет изображение оффера. Ожидает передаваемое изображение в multipart. Название FormData объекта 'image'.

    image {FormData}

`/offer PUT` - Изменение Названия и комментария оффера. Принимает title и description, если передан один из них то меняет только его, если ничего не передано, ничего не меняет. если переданы оба, то меняет оба последовательно.

    title — {string} - название
    description — {string} - описание

`/offer/status PUT` - Изменение статуса оффера. Скрыто за посредниками auth, и onlyAdmin

    status — {Types.OffferStatus} - статус
    warning — {string?}

`/offer/:id GET` - Получение оффера по ид, доступно только создателю и админу.

`/offer GET` Получение списка офферов 

    self {1|0} - своих ли список офферов запрашивает админ
    limit {number} - количество на странице 
    current {number} - номер страницы

`/offer/:id DELETE` Удаление оффера, доступно толко создателю, помечается archive=1 и не возвращается в выборках

### Вызовы статистики

`/statistic/graph GET` Получает статистику для графика, группировку выполняет в зависимости от временного шаблона, или по времени, или по дням, неделям и т.д.

    self — {1|0} - админ смотрит все или только свои
    time — {Types.Time} - временной шаблон
    customTime — {Date[]} - промежуток дат
    campaign — {number?} - если нужны данные по одной кампании

`/statistic/table GET` Возвращает статистику для таблицы, группированную по одному из типов

    limit — {number} - количество эелементов на странице
    current — {number} - запрашиваемая страница
    group — {Types.GroupBy} - по какому полю сгруппировать
    time — {Types.Time} - шаблон отсчета времени
    customTime — {Date[]} - промежуток дат
    self — {1|0} - когда админ запрашивает для себя
    sort — {Types.OrderByVariants} - сортировка по столбцу
    desc — {boolean} - сортировка с конца
    campaign — {number?} - номер кампании, когда нужна только одна

### Вызовы транзакций

`/transaction POST` - Создание транзакции

    amount — {number} - сумма
    comment — {string} - комментарий

`/transaction GET` - Получение транзакций

    filter — {Types.TransactionFilter} - по какому полю фильтровать по дате или пользователю
    value — {Date | number} - значение, дата или ид пользователя
    self — {1|0} - админ просит созданные им
    limit — {number} - количество на странице
    current — {number} - текущая страница