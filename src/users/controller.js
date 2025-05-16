const createError = require('http-errors');
const debug = require('debug')('app:module-users-controller');

const { UsersService } = require('./services.js');
const { Response } = require('../common/response.js')

module.exports.UsersController = {
    getUsers: async (req, res) => {
        try {
            let users = await UsersService.getAll()
            Response.success(res, 200, 'Lista de usuarios', users);
        } catch (error) {
            debug(error);
            Response.error(res)
        }
    },
    getUser: async (req, res) => {
        try {
            const { params: { id }} = req;
            let user = await UsersService.getById(id);
            if(!user){
                Response.error(res, new createError.NotFound());
            }
            Response.success(res, 200, `Producto ${id}`, user);
        } catch (error) {
            debug(error);
            Response.error(res)
        }
    },
    createUser: async (req, res) => {
        try {
            const { body } = req;
            if (!body || Object.keys(body).length === 0) {
                Response.error(res, new createError.BadRequest())
            } else {
                const insertedId = await UsersService.create(body);
                Response.success(res, 201, 'Usuario agregado', insertedId)
            }
        } catch (error) {
            debug(error);
            Response.error(res)
        }

    },
    //update
    updateUser: async (req, res) => {
        try {
            const {params: { id }, body } = req;
            if(!body || Object.keys(body).length === 0){
               Response.error(res, new createError.BadRequest()) 
            } else {
                const updatedId = await UsersService.updated(id, body);
                Response.success(res, 201, 'Usuario editado', updatedId)
            }
        } catch (error) {
            debug(error);
            Response.error(res)
        }
    },
    //delete
    deleteUser: async (req, res) => {
        try {
            const { params: { id }} = req;
            let user = await UsersService.deleted(id);
            if(!user){
                Response.error(res, new createError.NotFound());
            }
            Response.success(res, 200, `Usuario eliminado ${id}`, user);
        } catch (error) {
            debug(error);
            Response.error(res)
        }  
    },

};