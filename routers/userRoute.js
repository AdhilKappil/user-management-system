const express = require('express'); 
const path = require("path");
const userController = require("../controllers/userController"); 
const session = require('express-session');
const config = require('../config/config');
const auth = require('../middleware/auth'); 

const user_route = express();
// const nocache = require('nocache')
// user_route.use(nocache())

user_route.use(
    session({
      secret: config.sessionSecret,
      resave: false, 
      saveUninitialized:true,
  })
  );


user_route.set('view engine','ejs');
user_route.set('views','./views/users');

user_route.use(express.json());
user_route.use(express.urlencoded({ extended: true }));

user_route.get('/register',auth.isLogout,userController.loadRegister);

user_route.post('/register',userController.insertUser)

user_route.get('/',auth.isLogout,userController. loginLoad);
user_route.get('/login',userController. loginLoad);

user_route.post('/login',userController.verifyLogin);

user_route.get('/home',auth.isLogin,userController.loadHome);

user_route.get('/logout',auth.isLogin,userController.userLogout)

user_route.get('/edit',auth.isLogin,userController.editLoad);

user_route.post('/edit',userController.updateProfile)



module.exports = user_route; 