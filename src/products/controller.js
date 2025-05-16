const createError = require('http-errors');
const debug = require('debug')('app:module-products-controller');

const { ProductsService } = require('./services.js');
const { Response } = require('../common/response.js')

module.exports.ProductsController = {
    getProducts: async (req, res) => {
        try {
            let products = await ProductsService.getAll()
            Response.success(res, 200, 'Lista de productos', products);
        } catch (error) {
            debug(error);
            Response.error(res)
        }
    },
    getProduct: async (req, res) => {
        try {
            const { params: { id }} = req;
            let product = await ProductsService.getById(id);
            if(!product){
                Response.error(res, new createError.NotFound());
            }
            Response.success(res, 200, `Producto ${id}`, product);
        } catch (error) {
            debug(error);
            Response.error(res)
        }
    },
    createProduct: async (req, res) => {
        try {
            const { body } = req;
            if (!body || Object.keys(body).length === 0) {
                Response.error(res, new createError.BadRequest())
            } else {
                const insertedId = await ProductsService.create(body);
                Response.success(res, 201, 'Producto agregado', insertedId)
            }
        } catch (error) {
            debug(error);
            Response.error(res)
        }

    },
    //update
    updateProduct: async (req, res) => {
        try {
            const {params: { id }, body } = req;
            if(!body || Object.keys(body).length === 0){
               Response.error(res, new createError.BadRequest()) 
            } else {
                const updatedId = await ProductsService.updated(id, body);
                Response.success(res, 201, 'Producto editado', updatedId)
            }
        } catch (error) {
                        debug(error);
            Response.error(res)
        }
    },
    //delete
    deleteProduct: async (req, res) => {
        try {
            const { params: { id }} = req;
            let product = await ProductsService.deleted(id);
            if(!product){
                Response.error(res, new createError.NotFound());
            }
            Response.success(res, 200, `Producto eliminado ${id}`, product);
        } catch (error) {
            debug(error);
            Response.error(res)
        }  
    },
    generateReport: (req, res) => {
        try {
            ProductsService.generateReport('inventario', res);
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    }
};