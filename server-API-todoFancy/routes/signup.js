const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

/* GET users listing. */
router.post('/',userController.signUp);
module.exports = router;
