const jwt = require('jsonwebtoken');
const Stripe = require('stripe');
const { API_STRIPE_SK } = require('../helpers/Authentication');
const { con } = require('../helpers/connection');
const setToken = require('../hooks/setToken');

const stripe = Stripe(API_STRIPE_SK);

const loginUser = async (req, res) => {
    try {
        const database = await con();
        const collectionUser = database.collection('users');

        const user = await collectionUser.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }] });

        if (!user) return res.status(500).json({ error: "user not found", message: "wrong password or username" });


        const token = await setToken({ idStripe: user.idStripe, email: user.email, name: user.name });
        res.json({ token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

const loginAdmin = async (req, res) => {
    try {

        const account = await stripe.accounts.retrieve(req.body.accountId);

        if (account) {
            const token = jwt.sign({ id: req.body.accountId, email: req.body.email }, API_STRIPE_SK);
            return res.json({ token });

        } else res.status(500).json({ error: `Couldn't set token`, message: 'Error creating token in stripe' })

    } catch (error) {
        res.json({ error: error }).status(404);
    }
}

module.exports = { loginUser, loginAdmin };