const mysql = require('../mysql');


console.log('cadastro');


exports.postRegister = async (req, res, next) => {
    console.log("#######");
    console.log(req.body);

    /* Validation */
    var {name, cpf, email} = req.body;
    var nameerror;
    var cpfError;
    var emailError;

    if(name == undefined || name == ""){
        nameerror = true;
    }
    if(cpf == undefined || cpf == ""){
        console.log("####   CPF ###");
        cpfError = true;
    }
    if(email == undefined || email == ""){
        emailError =true;
    }

    console.log("erro");
    console.log(nameerror , cpfError, emailError );

    if(nameerror != undefined || cpfError != undefined || emailError != undefined){
        const response = {
            message: 'Validation failed',
            validationError: {
                nameerror: req.flash("nameerror",nameerror),
                cpfError: req.flash("cpfError",cpfError),
                emailError: req.flash("emailError",emailError)
            }
        }
        return res.status(203).send(response);
    }

    try {
        const query = 'INSERT INTO cadastro (name, cpf, email) VALUES (?,?,?)';
        const result = await mysql.execute(query, [
            req.body.name,
            req.body.cpf,
            req.body.email,
        ]);
        console.log("entoru");
        const response = {
            message: 'Produto inserido com sucesso',
            createdProduct: {
                productId: result.insertId,
                name: req.body.name,
                cpf: req.body.cpf,
                email: req.body.email,

                request: {
                    type: 'Post',
                    description: 'Retorna todos os produtos',
                    url: process.env.URL_API + 'produtos'
                }
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};
