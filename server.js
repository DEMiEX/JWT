require('rootpath')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('app/controller/error-handler');

// при необходимости создает тестового пользователя в БД при запуске
const createTestUser = require('app/model/create-test-user');
createTestUser();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// разрешаем запросы cors из любого источника и с учетными данными
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// api маршруты
app.use('/users', require('./app/route/routes'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;
app.listen(port, () => {
    console.log('Server listening on http://localhost:' + port);

});
