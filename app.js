
if(process.env.NODE_ENV!="production"){
  require('dotenv').config();
}

console.log(process.env.SECRET);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override"); 
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");

const userRouter = require("./routes/user.js"); // ✅ Correct

const listingRouter=require("./routes/listing.js");
const  reviewRouter=require("./routes/review.js");



const dbUrl = process.env.ATLASDB_URL;

if (!dbUrl) {
  console.error("❌ ERROR: Missing MongoDB Connection String! Set ATLASDB_URL in your environment variables.");
  process.exit(1); // Stop the server if the database URL is missing
}

main()
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  
  },
  touchAfter:24*3600,
  
  });
  store.on("error", (err) => {
    console.error("❌ ERROR in MONGO SESSION STORE:", err);
  });

const sessionOptions={
  store,

  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },  

};




// app.get("/",(req,res)=>{
//     res.send("hi,I am root");
// });
// const  validateListing=(req,res,next)=>{
//   let {error}=listingSchema.validate(req.body);
  
//   if(error){
//     let errMsg=error.details.map((el)=>el.message).join(",");
//     throw new ExpressError(400,result.error);
//   }else{
//     next();
//   }
// };


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  
  next();
});

// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"delta-student",
//   });
//  let registerdUser =await User.register(fakeUser,"helloworld");
//  res.send(registerdUser);

// })

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  req.flash("error", message); // ✅ Pass error message to flash
  res.status(statusCode).render("error.ejs", { message }); // ✅ Pass message to template
});



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
});

// app.get("/testListing",async(req,res)=>{
//   let sampleListing=new Listing({
//     title:"my new villa",
//     description:"by the beach",
//     price:1200,
//     location:"calangute,Goa",
//     country:"India",
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");

// });
// app.all("*",(req,res,next)=>{
//   next(new ExpressError(404,"Page Not Found"));
// });
// app.use((err,req,res,next)=>{
//   let{statusCode=500,message="Something went wrong !"}=err;
//   res.render("error.ejs");
//   // res.status(statusCode).send(message);

 
// });
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});  