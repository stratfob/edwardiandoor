const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let armourSchema = new Schema;

armourSchema.add({
    name: {
        type: String,
        required: true,
        unique: true
    },
    cost: {
        type: Number
    },
    strength:{
		type: Number
	}
});

Armour = mongoose.model('armour', armourSchema);
module.exports = Armour;
