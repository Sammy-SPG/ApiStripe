const Stripe = require('stripe');
const { API_STRIPE_SK } = require('../../helpers/Authentication');
const stripe = Stripe(API_STRIPE_SK);

const getSimilarProducts = async (req, res) => {
    try {
        const { rating } = req.body;
        const productSearchOptions = {
            limit: 9,
            query: `active: 'true' AND metadata['rating']:'${rating}'`
        };

        const products = await stripe.products.search(productSearchOptions);

        const dataProduct = await Promise.all(products.data.map(async (product) => {
            const priceSearchOptions = { query: `product: '${product.id}'` };
            const prices = await stripe.prices.search(priceSearchOptions);

            return {
                id_product: product.id,
                name: product.name,
                image: product.images[0],
                description: product.description,
                price: prices.data[0].unit_amount
            };
        }));

        res.json(dataProduct);

    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
}

module.exports = getSimilarProducts;