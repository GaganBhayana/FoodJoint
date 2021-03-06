var myFood = require("../models/myfood");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkmyFoodOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        myFood.findById(req.params.id, function(err, foundmyFood){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the myfood?
            if(foundmyFood.author.id.equals(req.user._id)) {// here .equals function is used since we are compairing an object with a string
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {// here .equals function is used since we are compairing an object with a string
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;