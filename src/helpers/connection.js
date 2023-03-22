const { MongoClient } = require("mongodb");

const url = 'mongodb://localhost:27017/';

const client = new MongoClient(url);

const con = async () => {
    try {
        const database = client.db("ecommerce");
        return database;
    } catch (err) {
        console.log(err);
    }
}


module.exports = { con, client };