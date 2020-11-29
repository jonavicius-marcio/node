const express = require('express');
const router = express.Router();

const userController = require('../controllers/user-controller');
const userRegisterController = require('../controllers/user-register-controller');

console.log('aqui!!');

router.get ('/', userController.getUser);


router.post('/', userController.createUser); // login de cliente
router.post('/login', userController.Login); // login de cliente

router.post('/register', userRegisterController.postRegister); //

module.exports = router;


