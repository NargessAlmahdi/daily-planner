const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  }, 
  
  details: {
    type: String,
  }, 

  priority: {
    type: Boolean,
    default: false,
    
  },
})


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tasks: [taskSchema],
});

module.exports = mongoose.model('User', userSchema);

