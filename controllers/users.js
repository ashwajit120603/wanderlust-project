const User=require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
 };


module.exports.signup=async(req,res)=>{
try{
    
    console.log(req.body);

    let{username,email,password}=req.body;
    const newUser=new User({email,username});
    const registerdUser=await User.register(newUser,password);
    console.log(registerdUser);
    req.login(registerdUser,(err)=>{
      if(err){
        return next(err);
      }  
      req.flash("success","welcome to WanderLust");
      res.redirect("/listings")
    }  );
  
}catch (e){
    req.flash("error",e.message);
    res.redirect("/signup");
}

};

module.exports.renderLoginForm= (req, res) => {
    res.render("users/login.ejs"); // Correct path to your login page
};

module.exports.login= async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl ||"/listings";
    res.redirect(redirectUrl); // ✅ Redirect to listings after login
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
        return     next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
         
    });
  };