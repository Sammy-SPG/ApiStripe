const dataProduct = require('../../hooks/getProduct');

const Home = async (req, res) => {
    try {
        const result = await dataProduct();
        res.json(result);

    } catch (error) {
        console.log(error);
        res.send({ error: error });
    }
}


module.exports = Home;