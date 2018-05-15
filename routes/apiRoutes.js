var express = require('express');
var db = require('../models');
const uuidv1 = require('uuid/v1');


require("dotenv").config();
var keys = require("../keys.js");
var stripeKeys = keys.Stripe;
const keyPublishable = stripeKeys.PUBLISHABLE_KEY;
const keySecret = stripeKeys.SECRET_KEY;
const stripe = require("stripe")(keySecret);

var router = express.Router();

{ // Maintenance Requests
    // POST - Post a maintenance request to the database
    router.post('/api/postMaintRequest', (req, res, next) => {

    });

    // POST - Mark a maintenance request as completed
    router.post('/api/completeMaintRequest', (req, res, next) => {

    });

    // GET - User gets all of their maintenance requests
    router.get('/api/getOwnMaintRequest', (req, res, next) => {

    });

    // GET -  Admin gets all of the maintenance requests that are open
    router.get('/api/getAllMaintRequests', (req, res, next) => {

    });
}

{ // Payments
    // POST - submits payment to stripe from tenant page
    router.post('/api/submitPayment', (req, res, next) => {

    });

    // GET - gets rent amount that the tenant owes
    router.get('/api/rentAmount', (req, res, next) => {

    });

    // GET - gets the tenant’s payment history
    router.get('/api/paymentHistory', (req, res, next) => {

    });

    // GET - gets all of the payment history for the admin
    router.get('/api/allPayments', (req, res, next) => {

    });
}

{ // Users
    // POST - Creates a user from the admin dashboard
    router.post('/api/createUser', (req, res, next) => {
      var data = req.body;
      data.activationCode = uuidv1();

      db.User.create(data).then(function(dbUser) {
        res.json({
          activationCode: dbUser.activationCode
        })
      }).catch(function(Error) {
        if(Error) throw console.log(Error);
      })
    });

    // POST - Activates a user
    router.post('/api/activateUser', (req, res, next) => {

    });

    // POST - Login local (provided by passport)
    router.post('/api/loginLocal', (req, res, next) => {

    });

    // POST - Login with google (provided by passport)
    router.post('/api/loginGoogle', (req, res, next) => {

    });

    // POST - Logout user (provided by passport)
    router.post('/api/logout', (req, res, next) => {

    });
}






//Creates the Strip modal for Credit card transaction that takes the card and email for from the person making the payment
router.post("/charge/card", (req, res) => {
  //TODO: Currently "amount" is statically set to $5. Amount needs to be linked to the database to get the users rent payment amount.

  let amount = 500;

  stripe.customers.create({
    email: req.body.email,
    card: req.body.id
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
      currency: "usd",
      customer: customer.id
    }))
  .then(charge => {
    console.log("successful payment");
    res.send(charge)
  })
  .catch(err => {
    console.log("Error:", err);
    res.status(500).send({error: "Purchase Failed"});
  });
});

module.exports = router;
