const { ObjectId } = require('mongodb');
const { Database } = require('../database/index.js');
const COLLECTION = 'sales';

const getAll = async () => {
    const collection = await Database(COLLECTION);
    return await collection.find({}).toArray();
}

const getById = async (id) => {
    const collection = await Database(COLLECTION);
    return collection.findOne({ _id: new ObjectId(id) });
}

const create = async (sale) => {
    const collection = await Database(COLLECTION);
    let result = collection.insertOne(sale);
    return result.insertedId;
}

//delete
const deleted = async (id) => {
    const collection = await Database(COLLECTION);
    return collection.deleteOne({ _id: new ObjectId(id)});
}

const updateProductStock = async (productId, quantity) => {
    const productsCollection = await Database('products');
    await productsCollection.updateOne( {_id: new ObjectId(productId)}, {$inc: {stock: -quantity}})
}

module.exports.SalesService = {
    getAll,
    getById,
    create,
    deleted,
    updateProductStock
}