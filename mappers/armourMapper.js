Armour = require('../models/armour');

const armours=
    [
        {
            name: 'Kevlar Vest',
            cost: 500,
            strength:10
        },
        {
            name: 'Diamond Plate Armour',
            cost: 10000,
            strength:50
        }
    ];

function addAllArmours(callback) {
    for (let i = 0; i < armours.length; i++){
        Armour.update({name: armours[i].name}, armours[i], {upsert: true}, function (err) {
            callback(err);
        });
    }
}

function getArmour(name,callback){
    if(name===null||name===undefined){
        name='Naked';
    }

    Armour.findOne({'name':name},function(err,res) {
        return callback(err, res);
    });
}

function getAllArmour(callback){
    Armour.find({
       
    }, function(err, results){
        return callback(err,results);
    });
}

module.exports = {addAllArmours, getArmour, getAllArmour};
