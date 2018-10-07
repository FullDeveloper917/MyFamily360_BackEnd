var api = require('../models/mobile_api_model');


exports.usernameexist = function(req, res) {
    var data = req.body;
    api.usernameexist(data.username, function(err, suc) {
        if (err) {
            res.send({'status':'FAIL'});
            // console.log({'status':'FAIL'});            
        }else {
            res.send({'status':suc});
            // console.log({'status':suc});
        }
    });
}

exports.emailexist = function(req, res) {
    var data = req.body;
    api.emailexist(data.email, function(err, suc) {
        if (err) {
            res.send({'status':'FAIL'});
            // console.log({'status':'FAIL'});            
        }else {
            res.send({'status':suc});
            // console.log({'status':suc});
        }
    });
}

exports.phonenumberexist = function(req, res) {
    var data = req.body;
    api.phonenumberexist(data.phonenumber, function(err, suc) {
        if (err) {
            res.send({'status':'FAIL'});
            // console.log({'status':'FAIL'});      
        }else {
            res.send({'status':suc});
            // console.log({'status':suc});
        }
    });
}

exports.signup = function(req, res) {
    var userInfo = req.body;
    api.signup(userInfo, function(err, suc) {
        if (err) {
            res.send({'status':'FAIL'});
        }else {
            res.send({'status':'SUCCESS'});
        }
    });
};

exports.login = function(req, res) {
    var logindata = req.body;
    api.login(logindata, function(err, suc) {
        if (err) {
            res.send({'status':'FAIL'});
        }else {
            if (suc.uid > 0) {
                if (suc.utype > 0){
                    res.send({'status':'SUCCESS', 'uid':suc.uid, 'usertype':suc.utype, 'kid':suc.kid});
                    // console.log({'status':'SUCCESS', 'userid':suc.uid, 'usertype':suc.utype, 'kid':suc.kid});
                }else {
                    res.send({'status':'SUCCESS', 'uid':suc.uid, 'usertype':suc.utype, 'phonenumber':suc.phonenumber});
                    // console.log({'status':'SUCCESS', 'userid':suc.uid, 'usertype':suc.utype, 'phonenumber':suc.phonenumber});
                }
            }else if (suc.uid < 0) {
                res.send({'status': 'UNVERIFIED'});
                // console.log({'status': 'UNVERIFIED'});
            }else {
                res.send({'status': 'FAIL'});
                // console.log({'status': 'FAIL'});
            }
        }
    });
};

//user
exports.getuserdata = function(req, res) {
    var data = req.body;
    api.getuserdata(data.uid, data.phonenumber, function(err, suc) {
        if (err) {
            res.send({'status':'FAIL'});
            // console.log({'status':'FAIL'});            
        }else {
            res.send({'status':'SUCCESS', 'profile':suc.profile, 'circles':suc.circles, 'kids':suc.kids, 'trackers':suc.trackers, 'babies':suc.babies});
        }
    });
};

//circle
exports.createcircle = function(req, res) {
    var data = req.body;
    api.createcircle(data.uid, data.circlename, function(err, suc) {
        if (err) {
            res.send({'status':'FAIL'});
            // console.log({'status':'FAIL'});
        }else {
            res.send({'status':suc});
            // console.log({'status':suc});
        }
    });
};

exports.getcircleslist = function(req, res) {
    var data = req.body;
    api.getcircleslist(data.uid, function(err, suc) {
        if (err) {
            res.send({'status':'FAIL'});
            // console.log({'status':'FAIL'});
        }else {
            res.send({'status':'SUCCESS', 'circles':suc});
            // console.log({'status':'SUCCESS', 'circles':suc});
        }
    });
};

exports.getinvitecode = function(req, res) {
    var data = req.body;
    api.getinvitecode(data.cid, function(err, suc) {
        if (err) {
            res.send({'status':'FAIL'});
            // console.log({'status':'FAIL'});
        }else {
            res.send({'status':'SUCCESS', 'invitecode':suc.invitecode});
            // console.log({'status':'SUCCESS', 'invitecode':suc});
        }
    });
}

exports.joincircle = function(req, res) {
    var data = req.body;
    api.joincircle(data.uid, data.invitecode, function(err, suc) {
        if (err) {
            res.send({'status':'FAIL'});
            // console.log({'status':'FAIL'});
        }else {
            res.send({'status':suc});
            // console.log(suc);
        }
    });
}

//member
exports.getmemberslist = function(req, res) {
    var data = req.body;
    api.getmemberslist(data.cid, function(err, suc){
        if (err) {
            res.send({'status':'FAIL'});
            // console.log({'status':'FAIL'});
        }else {
            res.send({'status':'SUCCESS', 'members':suc});
            // console.log({'status':'SUCCESS', 'members':suc});
        }
    }); 

};

//kid
exports.getkiddata = function(req, res) {
    var data = req.body;
    api.getkiddata(data.kid, function(err, suc) {
        if (err) {
            res.send({'status':'FAIL'});
            // console.log({'status':'FAIL'}); 
        }else {
            res.send({'status':'SUCCESS', 'profile':suc.profile, 'currentlocation':suc.currentlocation, 'fences':suc.fences, "history":suc.history, 'battery':suc.battery});
            // console.log({'status':'SUCCESS', 'profile':suc.profile, 'currentlocation':suc.currentlocation, 'fences':suc.fences, "history":suc.history, 'battery':suc.battery});
        }
    });
}

exports.addkid = function(req, res) {
    var kidinfo = req.body;
    api.addkid(kidinfo, function(err, suc) {
        if (err) {
            res.send({'status':'FAIL'});
            // console.log({'status':'FAIL'});
        }else {
            res.send({'status':suc});
            // console.log({'status':suc});
        }
    });
}

exports.getkidslist = function(req, res) {
    var data = req.body;
    api.getkidslist(data.pid, data.phonenumber, function(err, suc) {
        if (err) {
            res.send({'status':'FAIL'});
            // console.log({'status':'FAIL'});
        }else {
            res.send({'status':'SUCCESS', 'kidslist':suc});
            // console.log({'status':'SUCCESS', 'kidslist':suc});
        }
    });
}