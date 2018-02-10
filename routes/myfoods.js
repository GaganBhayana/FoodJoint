var express = require("express");
var router  = express.Router();
var myFood = require("../models/myfood");
var middleware = require("../middleware");


//INDEX - show all myfoods
router.get("/", function(req, res){
    // Get all myfoods from DB
    myFood.find({}, function(err, allmyFoods){
       if(err){
           console.log(err);
       } else {
          res.render("myfoods/index",{myfoods:allmyFoods});
       }
    });
});

//CREATE - add new myfood to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to myfoods array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newmyFood = {name: name, image: image, description: desc, author:author}
    // Create a new myfood and save to DB
    myFood.create(newmyFood, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to myfoods page
            console.log(newlyCreated);
            res.redirect("/myfoods");
        }
    });
});

//NEW - show form to create new myfood
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("myfoods/new"); 
});

// SHOW - shows more info about one myfood
router.get("/:id", function(req, res){
    //find the myfood with provided ID
    myFood.findById(req.params.id).populate("comments").exec(function(err, foundmyFood){
        if(err){
            console.log(err);
        } else {
            console.log(foundmyFood)
            //render show template with that myfood
            res.render("myfoods/show", {myfood: foundmyFood});
        }
    });
});

// EDIT myFood ROUTE
router.get("/:id/edit", middleware.checkmyFoodOwnership, function(req, res){
    myFood.findById(req.params.id, function(err, foundmyFood){
        res.render("myfoods/edit", {myfood: foundmyFood});
    });
});

// UPDATE myFood ROUTE
router.put("/:id",middleware.checkmyFoodOwnership, function(req, res){
    // find and update the correct myfood
    //------>>>>>  here req.body .myfood is recieved from the views/myfoods/edit file where we have grouped all the form inputs into a myfood object
    myFood.findByIdAndUpdate(req.params.id, req.body.myfood, function(err, updatedmyFood){
       if(err){
           res.redirect("/myfoods");
       } else {
           //redirect somewhere(show page)
           res.redirect("/myfoods/" + req.params.id);
       }
    });
});

// DESTROY myFood ROUTE
router.delete("/:id",middleware.checkmyFoodOwnership, function(req, res){
   myFood.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/myfoods");
      } else {
          res.redirect("/myfoods");
      }
   });
});


module.exports = router;

