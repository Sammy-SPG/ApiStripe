const { con } = require('../../helpers/connection');

const getPerfil = async (req, res) => {
    try {
        const { id } = req.user;
        console.log(id);

        const database = await con();
        const collectionCheckoutSessionItems = database.collection('users');
        const resSession = collectionCheckoutSessionItems.findOne({ idStripe: id }, { projection: { _id: 0, password: 0 } });

        return res.json(await resSession);

    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
}

module.exports = getPerfil;