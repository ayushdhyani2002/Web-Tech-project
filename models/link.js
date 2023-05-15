const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const linkSchema = new Schema({
    bigLink: {
        type: String,
        required: true
    },
    smallLink: {
        type: String,
        required: true,
        unique: true
    },
    by:{
        type: String,
    },
    usedip:{
        type: String,
    },
    usedtime:{
        type: String,
    },
    clicks: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Link = mongoose.model('Link', linkSchema);


module.exports = Link;
