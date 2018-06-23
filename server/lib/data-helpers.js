"use strict";

// Simulates the kind of delay we see with network or filesystem operations
// const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db, ObjectId) {
  const collection = db.collection('tweets');
  return {
    // Saves a tweet to `db`
    saveTweet(newTweet, callback) {
      // insert the new tweet to mongo db
      collection.insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in collection, sorted by newest first
    getTweets(callback) {
      const sortNewestFirst = (a, b) => b.created_at - a.created_at;
      // get all tweets from mongo db
      collection.find().toArray((collErr, coll) => {
        if (collErr) throw collErr;
        callback(null, coll.sort(sortNewestFirst));
      })
    },

    updateLikes(tweetId, callback) {
      // use the unique id to find the data set in mongo db and update the like_counter
      const objId = { '_id': ObjectId(tweetId) };
      collection.find(objId).toArray((collErr, coll) => {
        // if the current value is not a number, convert it to 0
        const currentCount = (coll[0].like_counter) ? coll[0].like_counter : 0;
        collection.update(objId, { $set: { 'like_counter': currentCount + 1 } });
      });
      callback(null, true);
    }
  };
}
