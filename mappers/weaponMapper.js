Weapon = require('../models/weapon');

const weapons= [
    {
        name:'Hammer',
        cost:5.00,
        damageRange:{min:4,max:6},
        melee:true,
        attackRate:8,
        baseHitPercentage:0.5,
        numberOfShots:-1,
        reloadTime:-1
    },
    {
        name:'Knife',
        cost:10.00,
        damageRange:{min:8,max:10},
        melee:true,
        attackRate:12,
        baseHitPercentage:0.4,
        numberOfShots:-1,
        reloadTime:-1
    }
];

function addAllWeapons(callback) {
    for (let i = 0; i < weapons.length; i++){
        Weapon.update({name: weapons[i].name}, weapons[i], {upsert: true}, function (err) {
            callback(err);
        });
    }
}

function getWeapon(name,callback){
    Weapon.findOne({'name':name},function(err,res) {
        return callback(err, res);
    });
}

function getHWWeapons(callback){
    Weapon.find({
        'name': { $in: [
                "Hammer",
                "Knife"
            ]}
    }, function(err, results){
        return callback(err,results);
    });
}

module.exports = {addAllWeapons, getHWWeapons, getWeapon};
