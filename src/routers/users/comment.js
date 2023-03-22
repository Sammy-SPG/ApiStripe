const { con } = require('../../helpers/connection');


const comment = async (req, res) => {
    try {
        const { id } = req.user;

        const database = await con();
        const collectionCommentsProducts = database.collection('commentsProducts');

        const publication = await collectionCommentsProducts.findOne({ id_publication: req.body.idProduct });

        if (!publication?._id) {
            const newComment = await collectionCommentsProducts.insertOne({ id_publication: req.body.idProduct, comments: [{ id_customer: id, name: req.body.name, content: req.body.content, date: req.body.date }] });
            return res.status(201).json({ acknowledged: newComment.acknowledged });
        }

        const comentList = await collectionCommentsProducts.updateOne(
            { id_publication: req.body.idProduct },
            {
                $push: {
                    comments:
                    {
                        $each: [{ id_customer: id, name: req.body.name, content: req.body.content, date: req.body.date }]
                    }
                }
            });

        if (comentList.modifiedCount > 0) {
            return res.status(201).json({ acknowledged: comentList.acknowledged });
        }

    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
}

module.exports = comment;