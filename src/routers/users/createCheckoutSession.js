const Stripe = require('stripe');
const jwt = require('jsonwebtoken');
const { API_STRIPE_SK } = require('../../helpers/Authentication');
const API_URL = require('../../helpers/const');
const stripe = Stripe(API_STRIPE_SK);

const createCheckoutSession = async (req, res) => {
    try {
        const { id } = req.user;

        const session = await stripe.checkout.sessions.create({
            success_url: `${API_URL}/product/success`,
            cancel_url: `${API_URL}/cancel/products`,
            customer: id,
            line_items: req.body.line_items,
            currency: "USD",
            mode: 'payment',
            payment_method_types: ['card']
        });

        res.json({ url: session.url, paymentIntent: session.id });
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
}

module.exports = createCheckoutSession;