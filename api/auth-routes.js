const express = require("express");
const router = require("express").Router();
const passport = require("passport");
const app = require("../app")
    // router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.post(
    "/login",
    function(req, res, next) {
        passport.authenticate('login', function(err, user, info) {
            var err = req.flash('message') || [];
            if (err[0] === 'User does not exists') {
                req.flash('message', 'User does not exists');
                res.json({
                    message: "User does not exists",
                    login: err
                })
                res.redirect('/register');

            } else if (err[0] === 'User password is incorrect') {
                req.flash('message', 'User password is incorrect')
                res.json({
                    message: "User password is incorrect",
                    login: err
                })
                res.redirect('/login');
            }
            req.logIn(user, function(err) {
                if (err) {
                    res.json({
                        login: err
                    })
                    return next(err);
                }
                res.json({
                        message: "Logged in...",
                    })
                    // return res.redirect('/profile');
            });

        })(req, res, next)
    });

router.get("/logout", (req, res) => {
    req.logout();
    res.json({
        message: "you are logged out..",
    })
    res.redirect("/");
});

router.get("/home", (req, res) => {
    res.json({
        message: "you are in auth home...",
    })
    res.render("home");
});
router.post(
    "/register",
    function(req, res, next) {
        passport.authenticate('custom', function(err, user, info) {
            var err = req.flash('message') || [];
            if (err[0] === 'User already exists') {
                req.flash('message', 'User already exists');
                res.json({
                    message: "User already exists",
                    register: err
                })
                res.redirect('/register');
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                res.json({
                    message: "sucessfully registed",
                    register: err
                })
                return res.redirect('/profile');
            });
        })(req, res, next)
    });

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    console.log("Hello");
    res.redirect("/profile");
});


module.exports = router;