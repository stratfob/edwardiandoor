const express = require('express');
const router = express.Router();
const marketMapper = require('../mappers/marketMapper');
const userMapper = require('../mappers/userMapper');
const isLoggedIn = require('../config/utils').isLoggedIn;
router.get('/', isLoggedIn, function (req, res) {
    marketMapper.getAllListings(function(error,results){
        userMapper.findUserByUsername(req.user.username,function(err,User){
            res.render('market', {user : req.user,  err: req.flash('err'), succ: req.flash('succ'), listings:results,
            userWeapons:User.weapons, userItems:User.items});
        });

    });
});

router.post('/new',isLoggedIn, function(req,res){
    let weapon = req.user.weapons[req.body.itemIndex];
    if(req.body.sellAmount>weapon.amount){
        req.flash('err', 'You do not own that many ' + weapon.name + '!');
        res.redirect('/market');
    }
    else{
        marketMapper.addListing(req.user._id,weapon.name,req.body.price,req.body.sellAmount,req.user.username,function(){});
        req.flash('succ', 'Item placed for sale!');
        res.redirect('/market');
    }
});

router.post('/buy',isLoggedIn, function(req,res){
    marketMapper.getListingById(req.body.item,function(err,result){
        if(req.body.amountToBuy>result.amount){
            req.flash('err', 'There aren\'t that many ' + result.name + ' for sale!');
            res.redirect('/market');
        }
        else if(req.body.amountToBuy*result.marketPrice > req.user.money){
            req.flash('err', 'You don\'t have enough money!');
            res.redirect('/market');
        }
        else{
            marketMapper.makeSale(req.body.item, req.user, result.seller, req.body.amountToBuy, function(){
                req.flash('succ', 'Sale made!');
                res.redirect('/market');
            });

        }
    });
});

module.exports = router;