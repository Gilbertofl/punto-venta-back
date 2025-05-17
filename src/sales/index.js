const express = require('express');
const { SalesController } = require('./controller.js');

const router = express.Router();

module.exports.SalesAPI = (app) => {
    router
        .get('/', SalesController.getSales)
        .get('/:id', SalesController.getSale)
        .post('/', SalesController.createSale)
        .delete('/:id', SalesController.deleteSale)
        // .get('/user/:userId', SalesController.getSalesByUser);

    app.use('/api/sales', router);
};