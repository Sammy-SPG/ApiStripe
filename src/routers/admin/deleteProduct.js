const Stripe = require('stripe');
const jwt = require('jsonwebtoken');
const { API_STRIPE_SK } = require('../../helpers/Authentication');
const stripe = Stripe(API_STRIPE_SK);

const deleteProduct = (req, res) => {
    jwt.verify(req.token, API_STRIPE_SK, async (err, data) => {
        if (err) return res.status(403).json({ message: err.message });
        try {
            const deleted = await stripe.products.del(req.params.id, { stripeAccount: data.userAdmin.id });
            res.json(products);
        } catch (error) {
            res.status(404).json({ error: error });
        }
    });
}

module.exports = deleteProduct;