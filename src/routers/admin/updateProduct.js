const Stripe = require('stripe');
const jwt = require('jsonwebtoken');
const { API_STRIPE_SK } = require('../../helpers/Authentication');
const stripe = Stripe(API_STRIPE_SK);
const { con } = require('../../helpers/connection');

const updateProductWithImages = async (req, stripeAccountId, database) => {
    const newPrice = await stripe.prices.create({
        unit_amount: Number(req.body.price) * 100,
        currency: 'USD',
        product: req.params.id,
    });

    const product = await stripe.products.update(
        req.params.id,
        { description: req.body.description, metadata: req.body.metadata, images: req.body.images, default_price: newPrice.id },
        { stripeAccount: stripeAccountId }
    );

    const collectionProduct = database.collection('product');
    const result = await collectionProduct.updateOne(
        { id_product: req.params.id },
        {
            $set:
            {
                id_price: newPrice.id,
                updated: product.updated,
                description: product.description,
                price: newPrice.unit_amount,
                metadata: req.body.metadata,
                images: req.body.images
            }
        });

    return result;
};

const updateProductWithoutImages = async (req, stripeAccountId, database) => {
    const newPrice = await stripe.prices.create({
        unit_amount: Number(req.body.price) * 100,
        currency: 'USD',
        product: req.params.id,
    });

    const product = await stripe.products.update(
        req.params.id,
        { description: req.body.description, metadata: req.body.metadata, default_price: newPrice.id },
        { stripeAccount: stripeAccountId }
    );

    const collectionProduct = database.collection('product');
    const result = await collectionProduct.updateOne(
        { id_product: req.params.id },
        {
            $set:
            {
                id_price: newPrice.id,
                updated: product.updated,
                description: product.description,
                price: newPrice.unit_amount,
                metadata: req.body.metadata
            }
        });

    return result;
};

const updateProduct = async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, API_STRIPE_SK);
        if (!decodedToken) return res.status(403).json({ message: err.message });

        const database = await con();

        let result;

        if (!req.body.images) {
            result = await updateProductWithoutImages(req, decodedToken.id, database);
        } else {
            result = await updateProductWithImages(req, decodedToken.id, database);
        }

        let prices = await stripe.prices.search({
            query: `product: '${req.params.id}'`,
        }, { stripeAccount: decodedToken.id });

        let previousPrice = await stripe.prices.update(
            prices.data[0].id,
            { "active": "false" },
            { stripeAccount: decodedToken.id }
        );

        if (result && previousPrice) res.json({ status: 'success' });

    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
}

module.exports = updateProduct;