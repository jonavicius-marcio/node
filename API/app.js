const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
var session = require("express-session");
var flash = require("express-flash");
var cookieParser = require("cookie-parser");
var cors=require("cors");

//rotas
const userRoute = require('./routes/user-route');

/*
const productRoute = require('./routes/product-route');
const categoryRoute = require('./routes/category-route');
const orderRoute = require('./routes/order-route');
const imageRoute  = require('./routes/image-route');
*/

app.use(morgan('dev'));
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));  // apenas dados simples
app.use(bodyParser.json()); // json de entrada no body
app.use(cookieParser("foxfoxfox")); // senha que irá usar para gerar o cookie
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } // tempo do cookie 1h
  }));
  app.use(flash());





app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});


app.use('/users', userRoute);

//app.use('/products', productRoute);
//app.use('/categories', categoryRoute);
//app.use('/orders', orderRoute);
//app.use('/images', imageRoute);


// Quando não encontra rota, entra aqui:
app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;