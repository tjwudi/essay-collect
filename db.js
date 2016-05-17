const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/collect');

module.exports = mongoose;
