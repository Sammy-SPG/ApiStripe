const jwt = require('jsonwebtoken');
const { API_STRIPE_SK } = require('../../helpers/Authentication');
const { con } = require('../../helpers/connection');

const getcheckout = async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, API_STRIPE_SK);
        if (!decodedToken) return res.status(403).json({ message: err.message });
        const database = await con();
        const collectionCheckoutSessionItems = database.collection('checkoutSessionItems');

        const resSessionCollection = await collectionCheckoutSessionItems.find({ id_customer: req.body.customer }, { projection: { _id: 0, id_customer: 0, id_session: 0 } }).toArray();
        return res.json(resSessionCollection);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
}

module.exports = getcheckout;