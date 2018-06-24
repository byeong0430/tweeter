"use strict";
const userHelper = require("../lib/util/user-helper")

const express = require('express');
const bcrypt = require('bcrypt');
const tweetsRoutes = express.Router();


module.exports = function (DataHelpers) {
  // because the whole router is mounted to /tweets in index.js, '/' actually means '/tweets'
  tweetsRoutes.get("/", (req, res) => {
    // check if user is still logged in
    const isLoggedIn = (req.session.length) ? true : false;

    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ tweets: tweets, isLoggedIn: isLoggedIn });
      }
    });
  })

  tweetsRoutes.post('/login', (req, res) => {
    // destructure req.body
    const { email, password } = req.body;
    DataHelpers.checkUser(email, (err, userRecord) => {
      const comparePasswords = bcrypt.compareSync(password, userRecord.password);
      // if either email or password was not provided, send an error message
      if (!email.length || !password.length) {
        res.status(400).json({ error: 'please complete the form' });
        return;
      }

      if (comparePasswords) {
        // if password record matches, save the id in a cookie and send the email back to client
        req.session.user_id = userRecord._id;
        res.status(200).json({ email: userRecord.email });
      } else {
        // send a warning message with a 400 status
        res.status(400).json({ error: 'incorrect email/password' });
      }
    });
  })

  tweetsRoutes.post('/signup', (req, res) => {
    // destructure req.body
    const { email, password } = req.body;

    // if either email or password was not provided, send an error message
    if (!email.length || !password.length) {
      res.status(400).json({ error: 'please complete the form' });
      return;
    }

    // hash the password
    const hashedPassword = bcrypt.hashSync(password, 13);
    DataHelpers.registerUser(email, hashedPassword, (err, recordId) => {
      if (err) {
        // duplicate email. error status should be a 400 series (client err)
        res.status(400).json({ error: err.message });
      } else {
        // save user id in cookie
        req.session.user_id = recordId;
        res.status(200).send();
      }
    })
  })

  tweetsRoutes.get('/logout', (req, res) => {
    req.session = null;
    res.status(200).send();
  })

  tweetsRoutes.post('/likes', (req, res) => {
    // get user id
    const { user_id } = req.session;

    if (!user_id) {
      res.status(400).json({ error: 'Please login first' });
      return;
    }

    // req.body.id is a unique id given to each tweet
    DataHelpers.updateLikes(req.body.id, err => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  })

  tweetsRoutes.post("/", (req, res) => {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body' });
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now(),
      like_counter: 0
    };

    DataHelpers.saveTweet(tweet, err => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  return tweetsRoutes;
}
