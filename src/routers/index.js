const express = require('express');
const router = express.Router();
const authorization_middleware_admin = require('../helpers/authorization_middleware_Admin');
const authorization_middleware_user = require('../helpers/authorization_middleware_user');
const verifyTokenAndStripe = require('../helpers/verifyTokenAndStripe');

const Home = require('./users/home');
const { loginUser, loginAdmin } = require('./login');

const getProducts = require('./admin/getProducts');
const updateProduct = require('./admin/updateProduct');
const createProduct = require('./admin/createProduct');
const disabledProduct = require('./admin/disabledProduct');
const getProduct = require('./admin/getProduct');
const getPerfil = require('./users/getPerfil');

const createCustomer = require('./users/createCustomer');
const getProductUser = require('./users/getProducts');
const getSimilarProducts = require('./users/getSimilarProducts');
const getPaymentIntent = require('./users/getPaymentIntent');
const createCheckoutSession = require('./users/createCheckoutSession');
const shoppingHistory = require('./users/shoppingHistory');
const shearsProduct = require('./users/shearsProduct');
const favorites = require('./users/favorites');
const getFavorites = require('./users/getFavorites');
const deleteFavorites = require('./users/deleteFavorites');
const comment = require('./users/comment');
const getComments = require('./users/getComment');
const getCustomers = require('./admin/getCustomers');
const getcheckout = require('./admin/getcheckout');


router.post('/v1/accounts/create/customer', createCustomer);
router.post('/v1/accounts/login', loginUser);
router.post('/v1/accounts/login/admin', loginAdmin);

router.get('/v1/products', Home);
router.get('/v1/products/:id', getProductUser);
router.post('/v1/products/querysimilar', getSimilarProducts);
router.post('/v1/shearsProduct', shearsProduct);
router.get('/v1/getComments/:id', getComments);


router.get('/v1/perfil/', authorization_middleware_user, verifyTokenAndStripe, getPerfil);
router.get('/v1/shoppingHistory', authorization_middleware_user, verifyTokenAndStripe, shoppingHistory);
router.get('/v1/product/succeeded/:id', authorization_middleware_user, verifyTokenAndStripe, getPaymentIntent);
router.get('/v1/getFavorites/', authorization_middleware_user, verifyTokenAndStripe, getFavorites);
router.post('/v1/favorites/',authorization_middleware_user, verifyTokenAndStripe, favorites);
router.post('/v1/product/create-checkout-session', authorization_middleware_user, verifyTokenAndStripe, createCheckoutSession);
router.post('/v1/product/comment', authorization_middleware_user, verifyTokenAndStripe, comment);
router.delete('/v1/favorites/', authorization_middleware_user, verifyTokenAndStripe, deleteFavorites);


router.get('/v1/admin/products/', authorization_middleware_admin, getProducts);
router.get('/v1/admin/products/:id', authorization_middleware_admin, getProduct);
router.get('/v1/admin/customers/', authorization_middleware_admin, getCustomers);
router.post('/v1/admin/checkout/', authorization_middleware_admin, getcheckout);

router.put('/v1/admin/update/product/:id', authorization_middleware_admin, updateProduct);
router.post('/v1/admin/create/', authorization_middleware_admin, createProduct);
router.delete('/v1/admin/disabled/product/:id', authorization_middleware_admin, disabledProduct);


module.exports = router;