const { con } = require('../../helpers/connection');


const shoppingHistory = async (req, res) => {
    try {
        const { id } = req.user;

        const database = await con();
        const collectionCheckoutSessionItems = database.collection('checkoutSessionItems');
        const resSession = await collectionCheckoutSessionItems.find({ id_customer: id }).toArray();

        const dataProduct = resSession.map((session) => {
            return {
                id_session: session.id_session,
                created: session.created,
                charge: session.charge,
                data: session.data
            };
        });

        if (dataProduct.length > 0) return res.json(dataProduct);
        else return res.status(402).json({ message: 'No items found' });
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
}

module.exports = shoppingHistory;