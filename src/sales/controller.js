const createError = require('http-errors');
const debug = require('debug')('app:module-sales-controller');

const { SalesService } = require('./services.js')
const { Response } = require('../common/response.js');
const { Database } = require('../database/index.js');
const { ObjectId } = require('mongodb');

module.exports.SalesController = {
    getSales: async (req, res) => {
        try {
            let sales = await SalesService.getAll();
            Response.success(res, 200, 'Lista de ventas', sales);
        } catch (error) {
            debug(error);
            Response.error(res)
        }
    },
    getSale: async (req, res) => {
        try {
            const { params: { id }} = req;
            let sale = await SalesService.getById(id);
            if(!sale){
               Response.error(res, new createError.NotFound()); 
            }
            Response.success(res, 200, `Venta ${id}`, sale)
        } catch (error) {
            debug(error);
            Response.error(res)
        }
    },
    createSale: async (req, res) => {
        try {
            const { body } = req;
            if(!body || !body.userId || !body.products || body.products.length === 0){
                Response.error(res, new createError.BadRequest('Datos de venta incompletos'));
                return;
            }

            //valida que el usuario exista
            const usersCollection = await Database('users');
            const user = await usersCollection.findOne({ _id: new ObjectId(body.userId)});
            if(!user){
                Response.error(res, new createError.NotFound('Usuario no encontrado'));
                return;
            }

            //valida procductos y calcular total
            const productsCollection = await Database('products');
            let total = 0;
            const productsWithPrice = [];

            for( const item of body.products) {
                const product = await productsCollection.findOne({ _id: new ObjectId(item.productId)});

                if(!product){
                    Response.error(res, new createError.NotFound(`Producto ${item.productId} no encontrado`));
                    return;
                }

                if(product.stock < item.quantity){
                    Response.error(res, new createError.NotFound(`Stock insuficiente para ${product.nombre}`));
                    return;                    
                }

                productsWithPrice.push({
                    productId: product._id,
                    quantity: item.quantity,
                    price: product.price,
                    name: product.name
                });

                total += product.price * item.quantity
            }

            //Crear objeto de venta
            const sale = {
                userId: new ObjectId(body.userId),
                products: productsWithPrice,
                total,
                date: new Date(),
                status: 'completed'
            };

            // Crear venta y actualizar stocks
            const insertedId = await SalesService.create(sale);
            
            // Actualizar stock de cada producto
            for (const item of body.products) {
                await SalesService.updateProductStock(item.productId, item.quantity);
            }

            Response.success(res, 201, 'Venta creada exitosamente', {
                saleId: insertedId,
                total
            });


        } catch (error) {
            debug(error);
            Response.error(res)
        }
    },
    deleteSale: async (req, res) => {
        try {
            const { params: { id } } = req;
            let sale = await SalesService.deleted(id);
            if (!sale) {
                Response.error(res, new createError.NotFound());
            } else {
                Response.success(res, 200, `Venta eliminada ${id}`, sale);
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },
    getSalesByUser: async (req, res) => {
        try {
            const { params: { userId } } = req;
            let sales = await SalesService.getByUserId(userId);
            Response.success(res, 200, `Ventas del usuario ${userId}`, sales);
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    }
}