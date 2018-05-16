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
    const newGang = new Gang({
        name:gang.name,
        members:gang.members,
        leader:gang.leader,
        moneyPool :gang.moneyPool,
        reports:gang.reports
    });
    newGang.save(function(err,res){
        callback(err,res);
    })
}

function addMember(gangId,memberId,callback){
    Gang.findOne({_id:gangId}, function (err,res) {
        let newMembers = res.members;
        newMembers.push(memberId);
        
        res.update({'members':newMembers},function(){
            callback();
        });
    });
}  

function removeMember(gangId,memberId,callback){
    if(gangId!=null){   
        Gang.findOne({_id:gangId}, function (err,res) {
            let newMembers = [];

            for (let i = 0; i < res.members.length; i++) {
                if (""+res.members[i] != ""+memberId) {
                    newMembers.push(res.members[i]);
                }
            }
            if(newMembers.length==0){
                res.remove(function(){
                    callback();
                });                
            }else{                                
                res.update({'members': newMembers}, function(){
                    callback();
                });                
            }
        });            
    }
    else{
        callback();
    }
}

module.exports = {getGang,getGangById, getAllGangs,createGang,addMember,removeMember};
