const { con } = require('../../helpers/connection');


const favorites = async (req, res) => {
    try {
        const { id } = req.user;

        const database = await con();
        const collectionFavoritesProducts = database.collection('favoritesProducts');

        const favorites = await collectionFavoritesProducts.findOne({ id_customer: id });

        if (!favorites?._id) {
            const newFavorite = await collectionFavoritesProducts.insertOne({ id_customer: id, products: [req.body.product] });
            return res.status(201).json({ acknowledged: newFavorite.acknowledged, message: 'Producto Agregado a favoritos' });
        }

        if(favorites.products.filter((product) => product === req.body.product).length > 0) return res.status(200).json({ "acknowledged": false, message: 'Ya tienes este producto en favoritos' });

        const favoritesList = await collectionFavoritesProducts.updateOne(
            { id_customer: id },
            {
                $push: {
                    products:
                    {
                        $each: [req.body.product]
                    }
                }
            });

        if (favoritesList.modifiedCount > 0) {
            return res.status(201).json({ acknowledged: favoritesList.acknowledged, message: 'Producto Agregado a favoritos' });
        }

    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
}

module.exports = favorites;