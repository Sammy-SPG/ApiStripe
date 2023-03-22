const Stripe = require('stripe');
const { API_STRIPE_SK } = require('../helpers/Authentication');
const jwt = require('jsonwebtoken');

const stripe = Stripe(API_STRIPE_SK);

const setToken = async ({ email, name, idStripe }) => {
    console.log(idStripe);
    const tokenStripe = await stripe.tokens.create({
        person: {
            email,
            first_name: name,
            metadata: {
                id: idStripe
            }
        },
    });
    return jwt.sign({ tokenStripe, id: idStripe, email }, API_STRIPE_SK);
}


module.exports = setToken;