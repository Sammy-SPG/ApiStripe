const jwt = require('jsonwebtoken');
const { API_STRIPE_SK } = require('../../helpers/Authentication');
const dataProduct = require('../../hooks/getProduct');

const getProductUser = async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, API_STRIPE_SK);
        if (!decodedToken) return res.status(403).json({ message: err.message });

        const result = await dataProduct();
        res.json(result);

    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
}

module.exports = getProductUser;