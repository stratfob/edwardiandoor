Weapon = require('../models/weapon');

const weapons= [
    {
        name:'Fists',
        cost:0,
        damageRange:{min:1,max:2},
        melee:true,
        attackRate:20,
        baseHitPercentage:0.6,
        numberOfShots:-1,
        reloadTime:-1
    },
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
    },
    {
        name:'.32 Pistol',
        cost:100.00,
        damageRange:{min:50,max:60},
        melee:false,
        attackRate:22,
        baseHitPercentage:0.3,
        numberOfShots:6,
        reloadTime:40
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
    if(name===null||name===undefined){
        name='Fists';
    }

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

function getGunWeapons(callback){
    Weapon.find({
        'name': { $in: [
                ".32 Pistol"
            ]}
    }, function(err, results){
        return callback(err,results);
    });
}

module.exports = {addAllWeapons, getHWWeapons, getGunWeapons, getWeapon};
