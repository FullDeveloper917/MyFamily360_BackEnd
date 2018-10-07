var mysqlClient = require('../mysqlClient').mysqlClient(),
    bcrypt = require('bcrypt'),
    async = require('async'),
    radomstring = require('randomstring');

function usernameexist(username, callback) {
    var sql = "SELECT * FROM tblusers WHERE username='" + username + "'";
    mysqlClient.query(
        sql,
        function selectCb(err, results, fields) {
            if (err) {
                callback(err, null);
            }else {
                if (results.length > 0) {
                    callback(null, "EXIST");
                }else {
                    callback(null, "NO EXIST");
                }
            }
        }
    );
}

function emailexist(email, callback) {
    var sql = "SELECT * FROM tblusers WHERE email='" + email + "'";
    mysqlClient.query(
        sql,
        function selectCb(err, results, fields) {
            if (err) {
                callback(err, null);
            }else {
                if (results.length > 0) {
                    callback(null, "EXIST");
                }else {
                    callback(null, "NO EXIST");
                }
            }
        }
    );

}

function phonenumberexist(phonenumber, callback) {
    var sql = "SELECT * FROM tblusers WHERE phonenumber='" + phonenumber + "'";
    mysqlClient.query(
        sql,
        function selectCb(err, results, fields) {
            if (err) {
                callback(err, null);
            }else {
                if (results.length > 0) {
                    callback(null, "EXIST");
                }else {
                    callback(null, "NO EXIST");
                }
            }
        }
    );

}

function signup(user, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            mysqlClient.query(
                'INSERT INTO ' + 'tblusers ' + 
                'SET firstname = ?, lastname = ?, username = ?, email = ?, phonenumber = ?, street1 = ?, street2 = ?, city = ?, state = ?, zipcode = ?, country = ?, photo = ?, password = ?',
                [user.firstname, user.lastname, user.username, user.email, user.phonenumber, user.street1, user.street2, user.city, user.state, user.zipcode, user.country, user.photo, user.password], 
                function(err, suc) {
                    if (err) {
                        callback(err, null);
                    }else {
                        callback(null, suc);
                    }
                }
            );
        }); 
    });
}

function login(data, callback) {
    getUserByUsername(data.username, function(err, findUser) {
        if (err) {
            callback(err, null);
        }else {
            if (findUser) {
                bcrypt.compare(data.password, findUser.password, function(err, res) {
                    if (res) {
                        if (findUser.usertype === 0) {
                            // callback(null, findUser);
                            if (findUser.verify > 0) {
                                callback(null, {'uid': findUser.id, 'utype': findUser.usertype, 'phonenumber': findUser.phonenumber});
                            }else {
                                callback(null, {'uid': -1});
                            }
                        }else if (findUser.usertype > 0) {
                            getKidByUserID(findUser.id, function(err, findKid) {
                                if (err) {
                                    callback(err, null);
                                }else {
                                    if (findKid) {
                                        callback(null, {'uid':findUser.id, 'utype': findUser.usertype, 'kid': findKid.id});
                                    }else {
                                        callback(null, {"state": "Empty kid"});
                                    }
                                }
                            });
                        }
                    }else {
                        callback(err, null);
                    }
                });
            }else {
                callback({err: "No user"}, null);
            }
        }
    });
}

function getUserByUsername (username, callback) {
    mysqlClient.query(
        "SELECT * FROM tblusers WHERE username='" + username + "'", 
        function selectCb(err, results, fields) {
            if (err) {
                callback(err, null);
            }else {
                if (results.length > 0) {
                    callback(null, results[0]);
                }else {
                    callback({err: "User is Empty"}, null);
                }
            }
        }
    );
}

function getKidByUserID (uid, callback) {
    mysqlClient.query(
        "SELECT id FROM tblkids WHERE uid='" + uid + "'",
        function selectCb(err, results, fields) {
            if (err) {
                callback(err, null);
            }else {
                if (results.length > 0) {
                    callback(null, results[0]);
                }else {
                    callback({err: "Kid is Empty"}, null);
                }
            }
        }
    );
}

//User
function getuserdata(uid, phonenumber, callBK) {
    async.parallel({
        profile: function(callback) {
            var sql = 'SELECT firstname, lastname, username, email, phonenumber, street1, street2, city, state, country FROM tblusers WHERE id = ' + uid;
            mysqlClient.query(
                sql,
                function selectCb(err, results, fields) {
                    if (err) {
                        callback(err, null);
                    }else {
                        callback(null,results);
                    }
                }
            );
        },
        circles: function (callback) {
            var sql = 'SELECT * FROM tblcircles WHERE uid=' + uid;
            mysqlClient.query(
                sql,
                function selectCb(err, results, fields) {
                    if (err) {
                        callback(err, null);
                    }else {
                        callback(null, results);
                    }
                }
            );
        },
        kids: function(callback) {
            var sql = "SELECT * FROM tblkids WHERE pid=" + uid + " OR phone1='" + phonenumber + "' OR phone2='" + phonenumber + "' OR phone3='" + phonenumber + "'";
            mysqlClient.query(
                sql,
                function selectCb(err, results, fields) {
                    if (err) {
                        callback(err, null);
                    }else {
                        callback(null, results);
                    }
                }
            );  
        },
        trackers: function(callback) {
            var sql = "SELECT * FROM tbltrackers WHERE uid=" + uid + " OR phone1='" + phonenumber + "' OR phone2='" + phonenumber + "' OR phone3='" + phonenumber + "'";
            mysqlClient.query(
                sql,
                function selectCb(err, results, fields) {
                    if (err) {
                        callback(err, null);
                    }else {
                        callback(null, results);
                    }
                }
            );
        },
        babies: function(callback) {
            var sql = "SELECT * FROM tblbabies WHERE uid=" + uid + " OR phone1='" + phonenumber + "' OR phone2='" + phonenumber + "' OR phone3='" + phonenumber + "'";
            mysqlClient.query(
                sql,
                function selectCb(err, results, fields) {
                    if (err) {
                        callback(err, null);
                    }else {
                        callback(null, results);
                    }
                }
            );
        }
    }, function(err, results){
        if (err) {
            callBK(err, null);
        }else {
            callBK(null, results);
        }
    });
}

function getuserprofile(uid, callback) {
    var sql = 'SELECT firstname, lastname, username, email, phonenumber, street1, street2, city, state, country FROM tblusers WHERE id = ' + uid;
    mysqlClient.query(
        sql,
        function selectCb(err, results, fields) {
            if (err) {
                callback(err, null);
            }else {
                if (results.length > 0) {
                    callback(null, results[0]);
                }else {
                    callback({err: "User is Empty"}, null);
                }
            }
        }
    );
}

//Circle
function createcircle(uid, circlename, callBK) {

    mysqlClient.query(
        "SELECT * FROM tblcircles WHERE uid=" + uid + " and circlename='" + circlename + "'",
        function selectCN(err, results, fields) {
            if (err) {
                callBK(err, null);
            }else {
                if (results.length > 0) {
                    callBK(null, "Circle Name Exist");
                }else {
                    var invitecode = radomstring.generate(8);
                    async.waterfall([
                        function(callback) {
                            var sql = "SELECT * FROM tblcircles WHERE invitecode='" + invitecode + "'";
                            mysqlClient.query(
                                sql,
                                function selectCb(err, results, fields) {
                                    if (err) {
                                        callback(err, null);
                                    }else {
                                        if (results.length > 0) {
                                            callback(null, "Exist");
                                        }else {
                                            callback(null, "No Exist");
                                        }
                                    }
                                }
                            );
                        }, 
                        function(state, callback) {
                            if (state == "Exist") {
                                createCircle(uid, circlename, callBK);
                            }else if (state == "No Exist") {
                                mysqlClient.query(
                                    'INSERT INTO ' + 'tblcircles ' + 
                                    'SET uid = ?, circlename = ?, invitecode = ?',
                                    [uid, circlename, invitecode], 
                                    function(err, suc) {
                                        if (err) {
                                            callback(err, null);
                                        }else {
                                            callback(null, suc.insertId);
                                        }
                                    }
                                );
                            }
                        }, 
                        function (cid, callback) {
                            mysqlClient.query(                                
                                'INSERT INTO ' + 'tblmembers ' + 
                                'SET cid = ?, uid = ?',
                                [cid, uid], 
                                function(err, suc) {
                                    if (err) {
                                        callback(err, null);
                                    }else {
                                        if (suc.insertId > 0) {
                                            callback(null, "SUCCESS");
                                        }else {
                                            callback(null, "FAIL");
                                        }                                        
                                    }
                                }
                            );
                        }
                
                    ], function(err, results) {
                        if (err) {
                            callBK(err, null);
                        }else {
                            callBK(null, results);
                        }
                    });
                }
            }
        }
    );

}

function getcircleslist(uid, callback) {
    var sql = 'SELECT * FROM tblcircles WHERE uid=' + uid;
    mysqlClient.query(
        sql,
        function selectCb(err, results, fields) {
            if (err) {
                callback(err, null);
            }else {
                callback(null, results);
            }
        }
    );
}

function getinvitecode(cid, callback) {
    var sql = "SELECT invitecode FROM tblcircles WHERE id=" + cid;
    mysqlClient.query(
        sql,
        function selectCb(err, results, fields) {
            if (err) {
                callback(err, null);
            }else {
                callback(null, results[0]);
            }
        }
    );
}

function joincircle(uid, invitecode, callBK) {

    async.waterfall([
        function(callback) {
            var sql = "SELECT id FROM tblcircles WHERE invitecode='" + invitecode + "'";
            mysqlClient.query(
                sql,
                function selectCb(err, results, fields) {
                    if (err) {
                        callback(err, null)
                    }else {
                        if (results.length > 0) {
                            callback(null, null, results[0].id);
                        }else {
                            callback(null, 'INVALID', null);
                        }
                    }
                }
            );            
        },
        function(validstate, cid, callback) {
            if (validstate) {
                callback(null, validstate);
            }else if (cid) {
                var sql = "SELECT * FROM tblmembers WHERE cid='" + cid + "' and uid=" + uid;
                mysqlClient.query(
                    sql,
                    function selectCb(err, results, fields) {
                        if (err){
                            callback(err, null);
                        }else {
                            // console.log({'checkjoin--->':results});
                            if (results.length > 0) {
                                callback(null, "EXIST");
                            }else {
                                mysqlClient.query(                                
                                    'INSERT INTO ' + 'tblmembers ' + 
                                    'SET cid = ?, uid = ?',
                                    [cid, uid], 
                                    function(err, suc) {
                                        if (err) {
                                            callback(err, null);
                                        }else {
                                            if (suc.insertId > 0) {
                                                callback(null, 'SUCCESS');
                                            }else {
                                                callback(null, 'FAIL');
                                            }                                        
                                        }
                                    }
                                );
                            }
                        }
                    }
                );
            }
        }

    ], function(err, results) {
        if (err) {
            callBK(err, null);
        }else {
            callBK(null, results);
        }
    });

}


//Kid
function getkiddata(kid, callBK) {
    async.parallel({
        profile: function(callback) {
            var sql = "SELECT * FROM tblkids WHERE id=" + kid;
            mysqlClient.query(
                sql,
                function selectCb(err, results, fields) {
                    if (err) {
                        callback(err, null);
                    }else {
                        callback(null, results);
                    }
                }
            );
        },
        currentlocation: function(callback) {
            var sql = "SELECT lat, lon, locationaddress FROM tblhistory WHERE kid = " + kid + " order by id desc limit 0,1";
            mysqlClient.query(
                sql,
                function selectCb(err, results, fields) {
                    if (err) {
                        callback(err, null);
                    }else {
                        callback(null, results);
                    }
                }
            );
        },
        fences: function(callback) {
            var sql = "SELECT id, fencename, lat, lon, radius FROM tblfences WHERE kid = "+ kid + " order by id";
            mysqlClient.query(
                sql,
                function selectCb(err, results, fields) {
                    if (err) {
                        callback(err, null);
                    }else {
                        callback(null, results);
                    }
                }
            );
        },
        history: function(callback) {
            var sql = "SELECT * FROM tblhistory WHERE kid = " + kid;
            mysqlClient.query(
                sql,
                function selectCb(err, results, fields) {
                    if (err) {
                        callback(err, null);
                    }else {
                        callback(null, results);
                    }
                }
            );
        },
        battery: function(callback) {
            var sql = "SELECT remain FROM tblbattery WHERE kid = " + kid;
            mysqlClient.query(
                sql,
                function selectCb(err, results, fields) {
                    if (err) {
                        callback(err, null);
                    }else {
                        if (results.length > 0) {                            
                            callback(null, results[0].remain);
                        }else {
                            callback(null, '0');
                        }
                    }
                }
            );
        }
    }, function(err, results) {
        if (err) {
            callBK(err, null);
        }else {
            callBK(null, results);
        }
    });
}

function getkidslist(pid, phonenumber, callback) {
    var sql = "SELECT * FROM tblkids WHERE pid=" + pid + " OR phone1='" + phonenumber + "' OR phone2='" + phonenumber + "' OR phone3='" + phonenumber + "'";
    mysqlClient.query(
        sql,
        function selectCb(err, results, fields) {
            if (err) {
                callback(err, null);
            }else {
                callback(null, results);
            }
        }
    );
}

function addkid(kidinfo, callBK) {
    async.waterfall([
        function(callback) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(kidinfo.password, salt, function(err, hash) {
                    kidinfo.password = hash;
                    mysqlClient.query(
                        'INSERT INTO ' + 'tblusers ' + 
                        'SET firstname = ?, lastname = ?, username = ?, password = ?, usertype = ?',
                        [kidinfo.firstname, kidinfo.lastname, kidinfo.username, kidinfo.password, 1], 
                        function(err, suc) {
                            if (err) {
                                callback(err, null);
                            }else {
                                callback(null, suc.insertId);
                            }
                        }
                    );
                });
            });                    
        },
        function(uid, callback) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(kidinfo.closepw, salt, function(err, hash) {
                    kidinfo.closepw = hash;
                    mysqlClient.query(
                        'INSERT INTO ' + 'tblkids ' + 
                        'SET uid = ?, pid = ?, firstname = ?, lastname = ?, username = ?, password = ?, closepw = ?, phone1 = ?, phone2 = ?, phone3 = ?',
                        [uid, kidinfo.pid, kidinfo.firstname, kidinfo.lastname, kidinfo.username, kidinfo.password, kidinfo.closepw, kidinfo.phone1, kidinfo.phone2, kidinfo.phone3], 
                        function(err, suc) {
                            if (err) {
                                callback(err, null);
                            }else {
                                if (suc.insertId > 0) {
                                    callback(null, 'SUCCESS');
                                }else {
                                    callback(null, 'FAIL');
                                }
                            }
                        }
                    );
                });
            });
        }
    ], function(err, results) {
        if (err) {
            callBK(err, null);
        }else {
            callBK(null, results);
        }
    });
}

//Tracker
function gettrackerslist(uid, phonenumber, callback) {
    var sql = "SELECT * FROM tbltrackers WHERE uid=" + uid + " OR phone1='" + phonenumber + "' OR phone2='" + phonenumber + "' OR phone3='" + phonenumber + "'";
    mysqlClient.query(
        sql,
        function selectCb(err, results, fields) {
            if (err) {
                callback(err, null);
            }else {
                callback(null, results);
            }
        }
    );
}

//Baby
function getbabieslist(uid, phonenumber, callback) {
    var sql = "SELECT * FROM tblbabies WHERE uid=" + uid + " OR phone1='" + phonenumber + "' OR phone2='" + phonenumber + "' OR phone3='" + phonenumber + "'";
    mysqlClient.query(
        sql,
        function selectCb(err, results, fields) {
            if (err) {
                callback(err, null);
            }else {
                callback(null, results);
            }
        }
    );
}

//Member
function getmemberslist(cid, callback) {
    var sql = "SELECT tblmembers.id, tblmembers.uid, tblusers.username, tblusers.phonenumber, tblusers.photo "
     + "FROM tblmembers " 
     + "JOIN tblusers ON tblmembers.uid = tblusers.id " 
     + "JOIN tblcircles ON tblmembers.cid = tblcircles.id " 
     + "WHERE cid = " + cid;
     mysqlClient.query(
         sql,
         function selectCb(err, results, fields) {
             if (err) {
                 callback(err, null);
             }else {
                 callback(null, results);
             }
         }
     );
}



exports.usernameexist = usernameexist;
exports.emailexist = emailexist;
exports.phonenumberexist = phonenumberexist;
exports.signup = signup;
exports.login = login;
exports.getuserdata = getuserdata;
exports.createcircle = createcircle;
exports.getcircleslist = getcircleslist;
exports.getmemberslist = getmemberslist;
exports.getinvitecode = getinvitecode;
exports.joincircle = joincircle;
exports.getkiddata = getkiddata;
exports.getkidslist = getkidslist;
exports.addkid = addkid;


exports.getuserprofile = getuserprofile;
exports.gettrackerslist = gettrackerslist;
exports.getbabieslist = getbabieslist;
