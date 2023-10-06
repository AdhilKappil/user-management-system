const User = require('../models/userModel');
const bcrypt = require("bcrypt");


//user login   
const loadLogin = async(req,res)=>{

    try {
        res.render('login'); 

    } catch (error) {
        console.log(error.message); 
    }
}

//admin email and password verification
const verifyLogin = async(req,res)=>{

    try {
        const email = req.body.email;
        const password = req.body.password;

       const userData = await User.findOne({email:email})

       if(userData){ 
         
         const passwordMath = await bcrypt.compare(password,userData.password)
         if(passwordMath){
           
            if(userData.is_admin === '0' ){
                
                res.render('login',{message:'Email or password is incorrect'});
            }else{
            
                 req.session.admin_id = userData._id;
                 res.redirect('/admin/home');
            }

         }else{
            res.render('login',{message:'Email or password is incorrect'});
         }

       }else{
         res.render('login',{message:'Email or password is incorrect'});
       }

    } catch (error) {
        console.log(error.message);
    }
}

//loading Home Page
const loadHome = async(req,res)=>{

    try {
         
        const userData = await User.findById({_id:req.session.admin_id});
        res.render('home', {admin:userData}); 
        


    } catch (error) {
        console.log(error.message); 
    }
}

//admin Logout
const   adminLogout = async(req,res)=>{

    try {
        
        req.session.destroy();
        res.redirect('/admin')

    } catch (error) {
        console.log(error.message);
        
    }
}

//Rendering Dashboard  
const adminDashboard = async(req,res)=>{

    try {

        var search=''
        if(req.query.search){
            search=req.query.search
        }
        const userData=await User.find({is_admin:0,
            $or:[
                {name:{$regex:'.*'+search+'.*',$options:'i'}},
                {email:{$regex:'.*'+search+'.*',$options:'i'}}
                
        ]
    })
        res.render('dashboard', {users:userData}); 

    } catch (error) {
        console.log(error.message); 
    }
}

//redering add new user page
const newUserLoad = async(req,res)=>{

    try {
        
        res.render('new-user'); 

    } catch (error) {
        console.log(error.message);
        
    }
}

//pasword security
const securePassword = async(password)=>{

    try {
        
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);
    }
}

//adding new user
const addUser = async(req,res)=>{

    try {
        const spassword = await securePassword(req.body.password)
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            password:spassword,
            is_admin:0
        })

        const userData = await user.save();

        if(userData){
            
            res.render('new-user',{message:"User registration is successfull"})
        }else{ 
            res.render('new-user',{message:"User registration is failed"})
        }
    } catch (error) {
        console.log(error.message); 
    }
}

//redndering user edit page
const editUserLoad = async(req,res)=>{

    try {

        const id = req.query.id;

        const userData = await User.findById({_id:id});

        if(userData){
            res.render('edit-user', {user:userData});
        }else{
            res.redirect('/admin/dashboard');
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

// updating user detailes
const updateUser = async(req,res)=>{

    try {

       const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mno}});
       res.redirect('/admin/dashboard');  

    } catch (error) {
        console.log(error.message);
    }
}

//delete user
const deleteUser = async(req,res)=>{

    try {

       const id = req.query.id;
       await User.deleteOne({ _id:id });
       res.redirect('/admin/dashboard');  

    } catch (error) {
        console.log(error.message);
    }
    
}

module.exports = {
    loadLogin,
    verifyLogin,
    loadHome,
    adminLogout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUser,
    deleteUser
}


