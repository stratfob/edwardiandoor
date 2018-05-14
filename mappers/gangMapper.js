Gang = require('../models/gang');

function getGang(name,callback){
   
    Gang.findOne({'name':name},function(err,res) {
        return callback(err, res);
    });
}

function getGangById(id,callback){
   
    Gang.findOne({_id:id},function(err,res) {
        return callback(err, res);
    });
}

function getAllGangs(callback){
    Gang.find({}, function(err, results){
        return callback(err,results);
    });
}

function createGang(gang,callback){
    Gang.update({name: gang.name}, gang, {upsert: true}, function (err) {
            callback(err);
    });
}

module.exports = {getGang,getGangById, getAllGangs,createGang};
