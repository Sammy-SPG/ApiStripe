const express = require('express');
const Router = require('./routers/index');
const cors = require("cors");
app = express();
app.set('port', process.env.PORT || 3000);

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(express.urlencoded());
app.use(express.json());

//middleware routes
app.use(Router);

app.listen(app.get('port'), () => {
    console.log(`listening on ${app.get('port')}`);
});