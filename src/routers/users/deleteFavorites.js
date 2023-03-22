const { con } = require('../../helpers/connection');


const deleteFavorites = async (req, res) => {
    try {
        const { id } = req.user;

        const database = await con();
        const collectionFavoritesProducts = database.collection('favoritesProducts');

        const favorites = await collectionFavoritesProducts.updateOne({ id_customer: id }, { $pull: { products: req.body.product } });

        if (favorites.modifiedCount < 1) return res.status(404).json({ acknowledged: false, message: 'No se encontró el producto para eliminar de favoritos' });

        return res.status(200).json({ acknowledged: favorites.acknowledged, message: 'Se elimo de favoritos' });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Hubo un error al intentar eliminar el producto de favoritos',
            error: error.message
        });
    }
}

module.exports = deleteFavorites;