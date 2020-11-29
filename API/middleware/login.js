const jwt = require('jsonwebtoken');
var JWT_KEY='segredo'

exports.required = (req, res, next) => {
    console.log("#### token"); 
    console.log(req.body.token); 
    try {
    
        const decode = jwt.verify(req.body.token, JWT_KEY);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).send({ mensagem: 'Falha na autenticação' });
    }

}

exports.optional = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, JWT_KEY);
        req.user = decode;
        next();
    } catch (error) {
        next();
    }

}