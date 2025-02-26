const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup)
);

router.route("/login")
.post( 
  saveRedirectUrl,
  passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
  }),
  userController.login
 
);

router.get("/login",userController.renderLoginForm);



router
  router.get("/logout",userController.login);

  router.get("/test", (req, res) => {
    res.send("User routes are working!");
});

module.exports=router;