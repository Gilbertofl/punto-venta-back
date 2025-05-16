const express = require('express');

const { UsersController } = require('./controller.js')

const router = express.Router();

module.exports.usersAPI = (app) => {
    router
        .get('/',  UsersController.getUsers) // http://localhost:3000/api/users/
        .get('/:id', UsersController.getUser) // http://localhost:3000/api/users/id
        .post('/',  UsersController.createUser)
        .delete('/:id', UsersController.deleteUser)
        .put('/:id', UsersController.updateUser)


    app.use('/api/users', router)
};
