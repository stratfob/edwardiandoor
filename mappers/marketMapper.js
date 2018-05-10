Market = require('../models/market');
userMapper = require('./userMapper');


function addListing(userId,name,price,amount,seller,callback){
    let newListing = new Market({name:name,marketPrice:price,amount:amount,seller:seller});
    userMapper.removeWeapon(userId, amount, name);
    newListing.save(callback);
}

function getAllListings(callback){
    Market.find(callback);
}

function getListingById(id,callback){
    Market.findOne({_id:id},callback);
}

function makeSale(listingId, user, seller, amount, callback) {
    userMapper.findUserByUsername(seller,function(error,result){
        Market.findOne({_id:listingId}, function (err,res) {
            if(amount<res.amount){
                userMapper.setMoney(user._id,(user.username===result.username)?user.money:(user.money-(res.marketPrice*amount)),function(){
                    userMapper.setMoney(result._id,(user.username===result.username)?result.money:(result.money+(res.marketPrice*amount)),function(){
                        userMapper.addWeapon(user._id,amount,res.name,function(){});
                        res.update({'amount': res.amount-amount}, callback);
                    });
                });
            }
            else{
                userMapper.setMoney(user._id,(user.username===result.username)?user.money:(user.money-(res.marketPrice*res.amount)),function(){
                    userMapper.setMoney(result._id,(user.username===result.username)?result.money:(result.money+(res.marketPrice*res.amount)),function(){
                        userMapper.addWeapon(user._id,res.amount,res.name,function(){});
                        Market.remove({_id:listingId},callback);
                    });
                });
            }

        });
    });

}


module.exports = {addListing, getAllListings, getListingById, makeSale};