const Stripe = require('stripe');
const jwt = require('jsonwebtoken');
const { API_STRIPE_SK } = require('../../helpers/Authentication');
const stripe = Stripe(API_STRIPE_SK);
const { con } = require('../../helpers/connection');

const disabledProduct = async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, API_STRIPE_SK);
        if (!decodedToken) return res.status(403).json({ message: "Invalid token session" });

        const database = await con();
        const CollectionProduct = database.collection('product');


        const product = await stripe.products.update(
            req.params.id,
            { active: false },
            { stripeAccount: decodedToken.id }
        );

        const price = await stripe.prices.update(
            product.default_price,
            { active: false },
            { stripeAccount: decodedToken.id }
        );

        const result = await CollectionProduct.deleteOne({ id_product: product.id });
        if (product && result && price) res.json(product);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
}

module.exports = disabledProduct;