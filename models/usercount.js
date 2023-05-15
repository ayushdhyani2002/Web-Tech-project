const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const visitSchema = new Schema({
    visit: {
        type: Number,
        default: 0
    }
});


const visit = mongoose.model('visit', visitSchema);


module.exports = visit;