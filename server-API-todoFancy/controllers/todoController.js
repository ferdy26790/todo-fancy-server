const todoModel = require('../models/todo')
var bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')
const getDecoded = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECURITY, function(err, decode){
      if(!err){
        resolve(decode)
      } else {
        reject(err)
      }
    })
  })
}
class Todo{
  static addTodo(req, res) {
    getDecoded(req.headers.token)
    .then((decode) => {
      let newTodo = new todoModel({
        name: req.body.name,
        userId: decode.user._id,
        reminder: req.body.time
      })
      newTodo.save()
      .then((todoAdded) => {
        res.status(200).json({
          todo: todoAdded
        })
      }).catch((err) => {
        res.status(500).send(err)
      })
    }).catch((err) => {
      res.status(500).send(err)
    })
  }
  static getTodos(req, res) {
    getDecoded(req.headers.token)
    .then((decode) => {
      todoModel.find({userId:decode.user._id})
      .then((todos) => {
        res.status(200).json({
          todo: todos
        })
      }).catch((err) => {
        res.status(500).send(err)
      })
    }).catch((err) => {
      res.status(500).send(err)
    })
  }
  static getTodo(req, res) {
    getDecoded(req.headers.token)
    .then((decode) => {
      todoModel.findById(req.params.id)
      .then((todo) => {
        if(todo.userId === decode.user._id) {
          res.staus(200).json({
            todo: todo
          })
        } else {
          res.status(401).send('unauthorized')
        }
      }).catch((err) => {
        res.status(500).send(err)
      })
    }).catch((err) => {
      res.status(500).send(err)
    })
  }
  static editTodo(req, res) {
    getDecoded(req.headers.token)
    .then((decode) => {
      todoModel.findById(req.params.id)
      .then((todo) => {
        if(todo.userId == decode.user._id) {
          todo.name = req.body.name || todo.name
          todo.reminder = req.body.reminder || todo.reminder
          todo.save()
          .then((todoEdited) => {
            res.status(200).json({
              msg: "todo edited",
              todo: todoEdited
            })
          }).catch((err) => {
            res.status(500).send(err)
          })
        } else {
          res.status(401).sen('unauthorized')
        }
      }).catch((err) => {
        res.status(500).send(err)
      })
    }).catch((err) => {
      res.status(500).send(err)
    })
  }
  static markComplete(req, res) {
    getDecoded(req.headers.token)
    .then((decode) => {
      todoModel.findById(req.params.id)
      .then((todo) => {
        if (todo.userId == decode.user._id) {
          todo.status = 'complete'
          todo.save()
          .then((todoSaved) => {
            res.status(200).json({
              msg: 'todo completed',
              todo: todoSaved
            })
          }).catch((err) => {
            res.status(500).send(err)
          })
        } else {
          res.status(402).send('unauthorized')
        }
      }).catch((err) => {
        res.status(500).send(err)
      })
    }).catch((err) => {
      res.status(500).send(err)
    })
  }
  static markUncomplete(req, res) {
    console.log('masuk', req.headers.token);
    getDecoded(req.headers.token)
    .then((decode) => {
      todoModel.findById(req.params.id)
      .then((todo) => {
        console.log(todo);
        if(todo.userId == decode.user._id) {
          if(todo.status == 'uncomplete') {
            res.status(200).json({
              msg: 'todo uncomplete',
              todo: todo
            })
          } else {
            todo.status = 'uncomplete'
            todo.save()
            .then((todoSaved) => {
              res.status(200).json({
                msg: 'todo uncomplete',
                todo: todoSaved
              })
            }).catch((err) => {
              res.status(500).send(err)
            })
          }
        } else {
          res.status(402).send('unauthorized')
        }
      }).catch((err) => {
        res.status(500).send(err)
      })
    }).catch((err) => {
      res.status(500).send(err)
    })
  }
  static deleteTodo(req, res) {
    getDecoded(req.headers.token)
    .then((decode) => {
      console.log(req.params.id);
      todoModel.findById(req.params.id)
      .then((todo) => {
        console.log('masuk', todo);
        console.log('masuk', todo.userId, decode.user._id)
        if(todo.userId == decode.user._id) {
          todoModel.findByIdAndRemove(req.params.id)
          .then((removedTodo) => {
            res.status(200).json({
              msg: "todo removed",
              todo: removedTodo
            })
          }).catch((err) => {
            res.status(500).send(err)
          })
        }
      }).catch((err) => {
        res.status(500).send(err)
      })
    }).catch((err) => {
      res.status(500).send(err)
    })
  }
}

module.exports = Todo;
