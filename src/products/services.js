const { ObjectId } = require('mongodb')

const { Database } = require('../database/index.js')

const { ProductsUtils } = require('./utils')

const COLLECTION = 'products'

const getAll = async () => {
    const collection = await Database(COLLECTION);
    return await collection.find({}).toArray();
}

const getById = async (id) => {
    const collection = await Database(COLLECTION);
    return collection.findOne({ _id: new ObjectId(id) });
}

const create = async (product) => {
    const collection = await Database(COLLECTION);
    let result = collection.insertOne(product);
    return result.insertedId;
}

//update
const updated = async (id, product) => {
    const collection = await Database(COLLECTION);
    let result = collection.updateOne({ _id: new ObjectId(id)}, {$set: product})
    return  result.updatedId;
}

//delete
const deleted = async (id) => {
    const collection = await Database(COLLECTION);
    return collection.deleteOne({ _id: new ObjectId(id)});
}

const generateReport = async (name, res) => {
    let products = await getAll();
    ProductsUtils.excelGenerator(products, name, res)
}

module.exports.ProductsService = {
    getAll,
    getById,
    create,
    generateReport,
    deleted,
    updated
}