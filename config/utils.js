
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}

function getLevelFromXp(xp){
	if(xp<10){
		return 1;
	}else if(xp<20){
		return 2;
	}else if(xp<40){
        return 3;
    }else if(xp<80){
        return 4;
    }else if(xp<160){
        return 5;
    }else if(xp<320){
        return 6;
    }else if(xp<640){
        return 7;
    }else if(xp<1280){
        return 8;
    }else if(xp<2560){
        return 9;
    }else{
        return 10;
    }
}

function getXpRequiredForLevel(level){
	if(level===1){
		return 0;
	}
	else{
        return Math.pow(2,level-2)*10
	}
}

function moneyReward (low, high){
    let num = Math.floor((Math.random() * (high-low)) + low) + Math.random();
    return Number((Math.round(num * 100) / 100).toFixed(2));
}

module.exports = {isLoggedIn, getLevelFromXp, getXpRequiredForLevel, moneyReward};
