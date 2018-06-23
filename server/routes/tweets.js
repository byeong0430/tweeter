"use strict";

const userHelper = require("../lib/util/user-helper")

const express = require('express');
const tweetsRoutes = express.Router();

module.exports = function (DataHelpers) {
  // because the whole router is mounted to /tweets in index.js, '/' actually means '/tweets'
  tweetsRoutes.get("/", (req, res) => {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post('/likes', (req, res) => {
    // req.body.id is a unique id given to each tweet
    DataHelpers.updateLikes(req.body.id, (err) => {
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
