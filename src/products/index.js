const express = require('express');

const { ProductsController } = require('./controller.js')

const router = express.Router();

module.exports.ProductsAPI = (app) => {
    router
        .get('/',  ProductsController.getProducts) // http://localhost:3000/api/products/
        .get('/report', ProductsController.generateReport)
        .get('/:id', ProductsController.getProduct) // http://localhost:3000/api/products/id
        .post('/',  ProductsController.createProduct)
        .delete('/:id', ProductsController.deleteProduct)
        .put('/:id', ProductsController.updateProduct)

    app.use('/api/products', router)
};
