const jwt = require('jsonwebtoken');
const Stripe = require('stripe');
const { API_STRIPE_SK } = require('../helpers/Authentication');
const stripe = Stripe(API_STRIPE_SK);

const verifyTokenAndStripe = async (req, res, next) => {
    try {
        const decodedToken = jwt.verify(req.token, API_STRIPE_SK);
        const tokenPerson = await stripe.tokens.retrieve(decodedToken.tokenStripe.id);

        if (!tokenPerson) {
            return res.status(403).json({ message: 'Invalid token session' });
        }

        // Almacenar la información del usuario en la solicitud para usarla en el siguiente middleware o ruta
        // console.log(decodedToken);
        req.user = decodedToken;

        // Llamar al siguiente middleware o ruta
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = verifyTokenAndStripe;