const { con } = require("../helpers/connection");

const dataProduct = async () => {
    try {
        const database = await con();
        const CollectionProduct = database.collection('product');
        const result = CollectionProduct.find().toArray();

        if (result.length === 0) return { error: "Product not found", message: 'No products in stock' };
        
        return result;
    } catch (error) {
        console.log(error);
        return { error: "Error finding products", message: "There was an error while retrieving the products" };
    }
}

module.exports = dataProduct;