const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let gangSchema = new Schema;

gangSchema.add({
    name: {
        type: String,
        required: true,
        unique: true
    },
    members:[{
        	type: mongoose.Schema.Types.ObjectId,
            ref: 'user'  
	}],
    leader:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
    },
    moneyPool:{
        type: Number
    },    
    reports:{
        type: [{date:Date, contents:String}]
    },
});

Gang = mongoose.model('gang', gangSchema);
module.exports = Gang;