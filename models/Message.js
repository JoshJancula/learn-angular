var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MessageSchema = new Schema({
    authorId: {
        type: String,
        required: true
    },
  authorName: {
        type: String,
        required: true
    },
  message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
      },
});



module.exports = mongoose.model('Message', MessageSchema);
