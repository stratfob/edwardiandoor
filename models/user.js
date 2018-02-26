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
    knobs: {
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
