const Stripe = require('stripe');
const jwt = require('jsonwebtoken');
const { API_STRIPE_SK } = require('../../helpers/Authentication');
const stripe = Stripe(API_STRIPE_SK);

const getProduct = async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, API_STRIPE_SK);
        if (!decodedToken) return res.status(403).json({ message: err.message });

        const products = await stripe.products.retrieve(req.params.id, { stripeAccount: decodedToken.id });
        const prices = await stripe.prices.search({ query: `product: '${products.id}'`, }, { stripeAccount: decodedToken.id });

        const dataProduct = {
            id: products.id,
            description: products.description,
            images: products.images,
            metadata: products.metadata,
            name: products.name,
            price: prices.data[0].unit_amount
        }
        res.json(dataProduct);
    } catch (error) {
        res.status(404).json({ error: error });
    }
}

module.exports = getProduct;