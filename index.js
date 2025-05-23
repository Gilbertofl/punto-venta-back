const express = require('express');
const debug = require('debug')('app:main');

const { Config } = require('./src/config/index.js')
const { ProductsAPI } = require('./src/products/index.js')
const { usersAPI } = require('./src/users/index.js')
const { SalesAPI } = require('./src/sales')
const { IndexAPI, NotFoundAPI } = require('./src/index/index.js')

const app = express();

app.use(express.json());

IndexAPI(app);
ProductsAPI(app);
usersAPI(app);
SalesAPI(app);
NotFoundAPI(app);

app.listen(Config.port, () => {
    debug(`Servidor escuchando en el puerto ${Config.port}`)
});