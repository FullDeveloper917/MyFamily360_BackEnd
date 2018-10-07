var express = require('express');
var router = express.Router();
var mobile = require('../controllers/mobile_api.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'APIS' });
});

router.post('/usernameexist', mobile.usernameexist);
router.post('/emailexist', mobile.emailexist);
router.post('/phonenumberexist', mobile.phonenumberexist);
router.post('/signup', mobile.signup);
router.post('/login', mobile.login);
router.post('/getuserdata', mobile.getuserdata);
router.post('/createcircle', mobile.createcircle);
router.post('/getcircleslist', mobile.getcircleslist);
router.post('/getmemberslist', mobile.getmemberslist);
router.post('/getinvitecode', mobile.getinvitecode);
router.post('/joincircle', mobile.joincircle);
router.post('/getkiddata', mobile.getkiddata);
router.post('/addkid', mobile.addkid);
router.post('/getkidslist', mobile.getkidslist);


module.exports = router;
