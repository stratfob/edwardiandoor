const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let weaponSchema = new Schema;

weaponSchema.add({
    name: {
        type: String,
        required: true,
        unique: true
    },
    cost: {
        type: Number
    },
    damageRange: {
        min: Number,
        max: Number
    },
    melee:{
        type:Boolean,
        required:true
    },
    attackRate: {
        type: Number
    },
    baseHitPercentage:{
        type: Number
    },
    numberOfShots: {
        type: Number
    },
    reloadTime: {
        type: Number
    }
});

Weapon = mongoose.model('weapon', weaponSchema);
module.exports = Weapon;
