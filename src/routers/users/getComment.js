const { con } = require('../../helpers/connection');


const getComments = async (req, res) => {
    try {
        const database = await con();
        const collectionCommentsProducts = database.collection('commentsProducts');
        const publication = await collectionCommentsProducts.findOne({ id_publication: req.params.id });
        if (!publication?._id) return res.status(404).json({ acknowledged: false, message: 'No such publication' })
        return res.status(200).json({ acknowledged: true, coments: publication.comments });

    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
}

module.exports = getComments;