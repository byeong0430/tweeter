"use strict";

// Simulates the kind of delay we see with network or filesystem operations
// const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {
    
    // Saves a tweet to `db`
    saveTweet: function (newTweet, callback) {
      // insert the new tweet to mongo db
      db.collection('tweets').insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in collection, sorted by newest first
    getTweets: function (callback) {
      const sortNewestFirst = (a, b) => b.created_at - a.created_at;
      // get all tweets from mongo db
      db.collection('tweets').find().toArray((collErr, coll) => {
        if (collErr) throw collErr;
        callback(null, coll.sort(sortNewestFirst));
      })
    }

  };
}
