var express = require('express');
var router = express.Router();
var todoController = require('../controllers/todoController')

/* GET home page. */
router.post('/', todoController.addTodo)
router.get('/', todoController.getTodos)
router.get('/:id', todoController.getTodo)
router.delete('/:id', todoController.deleteTodo)
router.put('/:id/complete', todoController.markComplete)
router.put('/:id/uncomplete', todoController.markUncomplete)
router.put('/:id', todoController.editTodo)

module.exports = router;
