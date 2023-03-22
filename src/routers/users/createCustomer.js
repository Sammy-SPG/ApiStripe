const Stripe = require('stripe');
const { API_STRIPE_SK } = require('../../helpers/Authentication');
const { con } = require('../../helpers/connection');
const setToken = require('../../hooks/setToken');
const stripe = Stripe(API_STRIPE_SK);

const createCustomer = async (req, res) => {
    try {
        const { email, name, phone, address, password } = req.body;
        const { id: idStripe, created } = await stripe.customers.create({ email, name, phone, address });

        const { acknowledged, insertedId } = await con().then(db => db.collection('users').insertOne({ idStripe, email, name, phone, address, password, created }));

        if (acknowledged && insertedId) {
            const token = await setToken({ idStripe: idStripe, email, name });
            return res.json({ token });
        } else {
            return res.status(500).json({ error: 'Error creating customer', message: "No se puede insertar el usuario el la base" })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}


module.exports = createCustomer;