const { con } = require('../../helpers/connection');

const getProduct = async (req, res) => {
    try {
        const database = await con();
        const CollectionProduct = database.collection('product');

        const result = await CollectionProduct.findOne({ id_product: req.params.id });
        if (result) res.json(result);
        else res.status(404).json({ error: 'Product not found' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = getProduct;