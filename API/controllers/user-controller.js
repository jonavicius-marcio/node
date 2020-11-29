const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var JWT_KEY="segredo";

// Retorna todos os pedidos 
    exports.getUser  =(req, res, next)=> { res.status(200).send({
        mensagem: 'teste'
    });
}

 
exports.createUser = async (req, res, next) => {

    console.log(req.body);

    try {
        var query = `SELECT * FROM login WHERE CPF = ?`;
        var result = await mysql.execute(query, [req.body.CPF]);
        console.log(result);
        if (result.length > 0) {
            return res.status(409).send({ message: 'Usuário já cadastrado' })
        }

        const hash = await bcrypt.hashSync(req.body.Senha, 10);
        console.log("########## senha hash");
        console.log(hash);
        query = 'INSERT INTO login (CPF, email, Cel, Senha) VALUES (?,?,?,?)';
        const results = await mysql.execute(query, 
            [
                req.body.CPF,
                req.body.email,
                req.body.Cel,
                hash
            ]);
        console.log("########## Results");
        console.log(results);
        const response = {
            message: 'Usuário criado com sucesso',
            createdUser: {
                userId: results.insertId,
                email: req.body.email
                
            }
        }
        return res.status(201).send(response);

    } catch (error) {
        console.log("########## errou");
        return res.status(500).send({ error: error });
    }
};

exports.Login = async (req, res, next) => {

    try {
        const query = `SELECT * FROM login WHERE email = ?`;
        var results = await mysql.execute(query, [req.body.email]);

        if (results.length < 1) {
            return res.status(401).send({ message: 'Falha na autenticação' })
        }

        if (await bcrypt.compareSync(req.body.Senha, results[0].Senha)) {
            const token = jwt.sign({
                userId: results[0].userId,
                email: results[0].email
            },
            JWT_KEY,
            {
                expiresIn: "1h"
            });
            return res.status(200).send({
                message: 'Autenticado com sucesso',
                token: token
            });
        }
        return res.status(401).send({ message: 'Falha na autenticação' })

    } catch (error) {
        return res.status(500).send({ message: 'Falha na autenticação' });
    }
};