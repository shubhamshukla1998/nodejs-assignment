const express = require("express");
const router = express.Router();
const {ensureAuth, ensureGuest} = require("../middleware/auth");
const Reg = require("../models/Reg");
const sanitize = require("mongo-sanitize");

router.get("/",ensureGuest, (req,res) => {
    res.render("login");
})

router.get("/dashboard",ensureAuth, (req,res) => {
    res.render("dashboard");
    console.log(res.user);
})

router.post("/register", ensureAuth, async (req, res) => {
    try {
      req.body.user = req.user.id;

      const regno = sanitize(req.body.regNo);
      const dupreg = await Reg.findOne({regNo : regno})

      if(dupreg){
          res.status(409).send("This registration number already exist");
      }else{
      await Reg.create({regNo : regno});
  
    //   res.redirect("/dashboard");
      console.log("created");
      res.send("Registration Successfull");
      }
    } catch (err) {
      console.error(err);
        res.send("Something Went Wrong")
    }
  });

module.exports = router;