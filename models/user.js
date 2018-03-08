const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema;

userSchema.add({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        required: true
    },
    reports:{
        type: [{date:Date, contents:String}]
    },
    weapons: {
        type: [Schema.ObjectId]
    },
    items: {
        type: [Schema.ObjectId]
    },
    health: {
        type: Number,
        required: true
    },
    currentActivity: {
        type: String
    },
    activityEnd: {
        type: Date
    },
    stealingSkill: {
        type: Number,
        required: true
    }

});
userSchema.index({
    email: 1
}, {
    unique: true
});

User = mongoose.model('user', userSchema);
module.exports = User;
