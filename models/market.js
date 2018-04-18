const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let marketSchema = new Schema;

marketSchema.add({
    name: {
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    marketPrice:{
        type: Number,
        required:true
    },
    seller:{
        type: String,
        required: true
    }
});

Market = mongoose.model('market', marketSchema);
module.exports = Market;
