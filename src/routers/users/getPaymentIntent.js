const Stripe = require('stripe');
const jwt = require('jsonwebtoken');
const { API_STRIPE_SK } = require('../../helpers/Authentication');
const { con } = require('../../helpers/connection');
const stripe = Stripe(API_STRIPE_SK);

const getPaymentIntent = async (req, res) => {

    try {
        // Verificamos el token y recuperamos el token de Stripe
        const { id } = req.user;

        const database = await con();
        const collectionCheckoutSessionItems = database.collection('checkoutSessionItems');
        const collectionProduct = database.collection('product');

        // Recuperamos la sesión de Stripe y su Payment Intent asociado
        const session = await stripe.checkout.sessions.retrieve(req.params.id);
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

        // Recuperamos los items de la sesión y los productos asociados
        const lineItems = await stripe.checkout.sessions.listLineItems(req.params.id);
        const products = await Promise.all(
            lineItems.data.map(item => collectionProduct.findOne({ id_product: item.price.product }, { projection: { id_product: 1, images: 1, _id: 0 } }))
        );

        // Armamos el objeto de respuesta con los datos necesarios
        const doc = {
            id_session: session.id,
            id_customer: id,
            created: session.created,
            charge: paymentIntent.charges.data[0].receipt_url,
            data: lineItems.data.map((item, index) => ({
                id_product: products[index].id_product,
                amount_total: item.amount_total,
                description: item.description,
                quantity: item.quantity,
                image: products[index].images[0],
            }))
        };

        // Si la sesión no existe, la creamos
        const resSessionCollection = await collectionCheckoutSessionItems.findOne({ id_session: session.id });
        if (!resSessionCollection) {
            const newResSession = await collectionCheckoutSessionItems.insertOne(doc);
            if (!newResSession.insertedId) {
                return res.json({ error: 'Error al insertar la sesion de pago' });
            }
        }

        // Devolvemos los datos de los productos comprados
        return res.json({data: doc.data, charge: doc.charge});
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
}

module.exports = getPaymentIntent;