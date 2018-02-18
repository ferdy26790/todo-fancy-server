var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const todoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'uncomplete'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reminder: {
    type: Date
  }
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo
