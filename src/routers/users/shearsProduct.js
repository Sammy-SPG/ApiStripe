const { con } = require('../../helpers/connection');

const shearsProduct = async (req, res) => {
    try {
        const database = await con();
        const collectionCheckoutSessionItems = database.collection('product');


        const keywords = req.body.name.split(' ');
        const regexArr = keywords.map(keyword => new RegExp(keyword, 'gi'));

        const resSession = await collectionCheckoutSessionItems.find({ name: { $all: regexArr }, "metadata.rating": { $regex: new RegExp(req.body.rating, 'i') } }).toArray();
        return res.json(resSession);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
}

module.exports = shearsProduct;