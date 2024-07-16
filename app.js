const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema} = require('./schema.js');

const port = 8000;

const mongo_url = "mongodb://localhost:27017/TravelNest";

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")))
app.engine('ejs',ejsMate);

main()
  .then(() => {
    console.log("connected to DB!");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

const validateListing = (req,res,next)=>{
  let {err} = listingSchema.validate(req.body);
    if(err){
      let errMsg  = err.details.map((el) => el.message).join(',');
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
}
//index route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
}));

//new route
app.get("/listings/new", wrapAsync(async (req, res) => {
  res.render("listings/new.ejs");
}));

//create route
app.post("/listings", validateListing,wrapAsync(async (req, res,next) => {
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  
 
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id",validateListing, wrapAsync(async(req, res) => {
  
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect('/listings');
}));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id, { ...req.body.listing });
  console.log(deletedListing);
  res.redirect('/listings');
}));

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

// app.get('/sampleListing',async(req,res)=>{
//     let sampleListing = new Listing({
//         title : 'My new Villa',
//         Description : 'By the beach',
//         price : 12000,
//         location : 'Calangute,Goa',
//         country : 'India'

//     });
//     await sampleListing.save();
//     console.log('sample was saved');
//     res.send('Succesfully saved listing');
// })

app.use("*",(req,res,next)=>{
 next(new ExpressError(404,'Page not Found!'));
})
//middleware
app.use((err,req,res,next) =>{
  let { statusCode = 500,message = "Something Went Wrong!"} = err;
  res.status(statusCode).render("listings/error.ejs",{message});
  // res.status(statusCode).send(message);
});

app.get("/", (req, res) => {
  res.send("hi i am root!");
});
app.listen(port, () => {
  console.log(`listining on ${port}`);
});
