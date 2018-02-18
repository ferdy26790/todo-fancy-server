const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

/* GET users listing. */
router.get('/',userController.findUsers)
// router.get('/fb', userController.loginFb)
router.post('/', userController.addUser)
router.get('/:id', userController.findUser)
router.put('/:id', userController.editUser)
router.delete('/:id', userController.deleteUser)
module.exports = router;
