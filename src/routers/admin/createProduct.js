const Stripe = require('stripe');
const jwt = require('jsonwebtoken');
const { API_STRIPE_SK } = require('../../helpers/Authentication');
const stripe = Stripe(API_STRIPE_SK);
const { con } = require('../../helpers/connection');

const createProduct = async (req, res) => {
    try {
        const decodedToken = jwt.verify(req.token, API_STRIPE_SK);
        if (!decodedToken) return res.status(403).json({ message: "Invalid token session" });

        const database = await con();
        const CollectionProduct = database.collection('product');

        const createdProduct = await stripe.products.create({
            name: req.body.product_name,
            description: req.body.description,
            metadata: req.body.metadata,
            images: req.body.images
        });

        const price = await stripe.prices.create({
            unit_amount: Number(req.body.price) * 100,
            currency: 'USD',
            product: createdProduct.id,
        });

        const priceUpdateProduct = await stripe.products.update(
            createdProduct.id,
            { default_price: price.id },
            { stripeAccount: decodedToken.id }
        );

        const doc = {
            id_product: createdProduct.id,
            id_price: price.id,
            created: createdProduct.created,
            updated: priceUpdateProduct.updated,
            name: createdProduct.name,
            description: createdProduct.description,
            price: price.unit_amount,
            metadata: req.body.metadata,
            images: req.body.images
        };

        const result = await CollectionProduct.insertOne(doc);

        if (createdProduct && price && result) res.json({ status: 'success', message: 'Producto creado' });
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }

}

module.exports = createProduct;