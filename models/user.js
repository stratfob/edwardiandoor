const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema;

userSchema.add({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
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
