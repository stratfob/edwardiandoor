Weapon = require('../models/weapon');

const weapons=
    [
        {
            name: 'Fists',
            cost: 0,
            damageRange: {min: 1,max: 2},
            melee: true,
            attackRate: 20,
            baseHitPercentage: 0.4,
            numberOfShots: -1,
            reloadTime: -1
        },
        {
            name: 'Brick',
            cost: 2,
            damageRange: {min: 2,max: 3},
            melee: true,
            attackRate: 45,
            baseHitPercentage: 0.8,
            numberOfShots: -1,
            reloadTime: -1
        },
        {
            name: 'Lead pipe',
            cost: 4,
            damageRange: {min: 4,max: 5},
            melee: true,
            attackRate: 40,
            baseHitPercentage: 0.6,
            numberOfShots: -1,
            reloadTime: -1
        },
        {
            name: 'Brass knuckles',
            cost: 7,
            damageRange: {min: 5,max: 6},
            melee: true,
            attackRate: 30,
            baseHitPercentage: 0.6,
            numberOfShots: -1,
            reloadTime: -1
        },
        {
            name: 'Hammer',
            cost: 10,
            damageRange: {min: 4,max: 6},
            melee: true,
            attackRate: 20,
            baseHitPercentage: 0.6,
            numberOfShots: -1,
            reloadTime: -1
        },
        {
            name: 'Machete',
            cost: 13,
            damageRange: {min: 8,max: 12},
            melee: true,
            attackRate: 35,
            baseHitPercentage: 0.6,
            numberOfShots: -1,
            reloadTime: -1
        },
        {
            name: 'Chef\'s knife',
            cost: 25,
            damageRange: {min: 8,max: 10},
            melee: true,
            attackRate: 12,
            baseHitPercentage: 0.4,
            numberOfShots: -1,
            reloadTime: -1
        },
        {
            name: 'Switch blade',
            cost: 40,
            damageRange: {min: 6,max: 10},
            melee: true,
            attackRate: 10,
            baseHitPercentage: 0.6,
            numberOfShots: -1,
            reloadTime: -1
        },
        {
            name: '.32 pistol',
            cost: 450,
            damageRange: {min: 50,max: 60},
            melee: false,
            attackRate: 22,
            baseHitPercentage: 0.3,
            numberOfShots: 6,
            reloadTime: 44
        },
        {
            name: 'Mosin nagant',
            cost: 600,
            damageRange: {min: 80,max: 90},
            melee: false,
            attackRate: 60,
            baseHitPercentage: 0.7,
            numberOfShots: 5,
            reloadTime: 120
        },
        {
            name: 'Glock',
            cost: 850,
            damageRange: {min: 55,max: 65},
            melee: false,
            attackRate: 20,
            baseHitPercentage: 0.4,
            numberOfShots: 17,
            reloadTime: 30
        },
        {
            name: 'Double barrelled shotgun',
            cost: 900,
            damageRange: {min: 100,max: 120},
            melee: false,
            attackRate: 70,
            baseHitPercentage: 0.8,
            numberOfShots: 2,
            reloadTime: 71
        },
        {
            name: '44 magnum',
            cost: 1200,
            damageRange: {min: 80,max: 90},
            melee: false,
            attackRate: 40,
            baseHitPercentage: 0.7,
            numberOfShots: 6,
            reloadTime: 40
        },
        {
            name: 'AR15',
            cost: 1250,
            damageRange: {min: 20,max: 30},
            melee: false,
            attackRate: 10,
            baseHitPercentage: 0.6,
            numberOfShots: 30,
            reloadTime: 30
        },
        {
            name: 'MP40',
            cost: 300,
            damageRange: {min: 30,max: 40},
            melee: false,
            attackRate: 18,
            baseHitPercentage: 0.5,
            numberOfShots: 30,
            reloadTime: 36
        },
        {
            name: 'Tech9',
            cost: 325,
            damageRange: {min: 20,max: 23},
            melee: false,
            attackRate: 8,
            baseHitPercentage: 0.4,
            numberOfShots: 30,
            reloadTime: 40
        },
        {
            name: 'Flame thrower',
            cost: 435,
            damageRange: {min: 5,max: 7},
            melee: false,
            attackRate: 5,
            baseHitPercentage: 0.9,
            numberOfShots: 100,
            reloadTime: 200
        },
        {
            name: 'Tommy gun',
            cost: 470,
            damageRange: {min: 30,max: 40},
            melee: false,
            attackRate: 15,
            baseHitPercentage: 0.5,
            numberOfShots: 30,
            reloadTime: 30
        },
        {
            name: 'Uzi',
            cost: 625,
            damageRange: {min: 20,max: 30},
            melee: false,
            attackRate: 8,
            baseHitPercentage: 0.4,
            numberOfShots: 30,
            reloadTime: 40
        },
        {
            name: 'Sawed-off',
            cost: 810,
            damageRange: {min: 130,max: 140},
            melee: false,
            attackRate: 70,
            baseHitPercentage: 0.7,
            numberOfShots: 2,
            reloadTime: 140
        },
        {
            name: 'UMP',
            cost: 980,
            damageRange: {min: 30,max: 40},
            melee: false,
            attackRate: 10,
            baseHitPercentage: 0.4,
            numberOfShots: 30,
            reloadTime: 30
        },
        {
            name: 'Spas12',
            cost: 1500,
            damageRange: {min: 100,max: 110},
            melee: false,
            attackRate: 40,
            baseHitPercentage: 0.7,
            numberOfShots: 6,
            reloadTime: 80
        },
        {
            name: 'Grenade',
            cost: 1700,
            damageRange: {min: 200,max: 220},
            melee: false,
            attackRate: 100,
            baseHitPercentage: 0.9,
            numberOfShots: 1,
            reloadTime: 500
        },
        {
            name: 'Desert eagle',
            cost: 1900,
            damageRange: {min: 90,max: 100},
            melee: false,
            attackRate: 30,
            baseHitPercentage: 0.6,
            numberOfShots: 10,
            reloadTime: 60
        },
        {
            name: 'Sniper rifle',
            cost: 2300,
            damageRange: {min: 100,max: 130},
            melee: false,
            attackRate: 50,
            baseHitPercentage: 0.9,
            numberOfShots: 5,
            reloadTime: 100
        },
        {
            name: 'Gatling gun',
            cost: 2700,
            damageRange: {min: 20,max: 25},
            melee: false,
            attackRate: 3,
            baseHitPercentage: 0.3,
            numberOfShots: 1000,
            reloadTime: 2000
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
                'Hammer',
                'Brick',
                'Lead pipe',
                'Brass knuckles',
                'Machete',
                'Chef\'s knife',
                'Switch blade'
            ]}
    }, function(err, results){
        return callback(err,results);
    });
}

function getGunWeapons(callback){
    Weapon.find({
        'name': { $in: [
                '.32 Pistol',
                'Mosin nagant',
                'Glock',
                'Double barrelled shotgun',
                '44 magnum',
                'AR15'

            ]}
    }, function(err, results){
        return callback(err,results);
    });
}

module.exports = {addAllWeapons, getHWWeapons, getGunWeapons, getWeapon};
