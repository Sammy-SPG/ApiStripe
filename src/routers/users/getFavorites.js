const { con } = require('../../helpers/connection');

const getFavorites = async (req, res) => {
    try {
        const { id } = req.user;

        const database = await con();
        const collectionFavoritesProducts = database.collection('favoritesProducts');
        const collectionProduct = database.collection('product');

        const favorites = await collectionFavoritesProducts.findOne({ id_customer: id });

        if (!favorites?._id) return res.status(200).json({ "acknowledged": false, message: 'No tienes ningun producto añadido a favoritos' });

        const products = await Promise.all(favorites.products.map(item => collectionProduct.findOne({ id_product: item }, { projection: { _id: 0 } })));

        return res.status(200).json({ "acknowledged": true, products });

    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
}

module.exports = getFavorites;