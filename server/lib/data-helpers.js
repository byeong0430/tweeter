"use strict";


// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db, ObjectId) {
  const tweetColl = db.collection('tweets');
  const userColl = db.collection('users');
  return {
    // Saves a tweet to `db`
    saveTweet(newTweet, callback) {
      // insert the new tweet to mongo db
      tweetColl.insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in collection, sorted by newest first
    getTweets(callback) {
      const sortNewestFirst = (a, b) => b.created_at - a.created_at;
      // get all tweets from mongo db
      tweetColl.find().toArray((collErr, coll) => {
        if (collErr) throw collErr;
        callback(null, coll.sort(sortNewestFirst));
      })
    },

    updateLikes(tweetId, callback) {
      // use the unique id to find the data set in mongo db and update the like_counter
      const objId = { '_id': ObjectId(tweetId) };
      tweetColl.find(objId).toArray((collErr, coll) => {
        // if the current value is not a number, convert it to 0
        const currentCount = (coll[0].like_counter) ? coll[0].like_counter : 0;
        tweetColl.update(objId, { $set: { 'like_counter': currentCount + 1 } });
      });
      callback(null, true);
    },

    registerUser(email, hashedPaswrd, callback) {
      // find if there is any duplicate email record
      userColl.find({ 'email': email }).toArray((collErr, coll) => {
        // return any error from mongodb
        if (collErr) throw collErr;

        // no duplicate record
        if (coll.length === 0) {
          // insert the user's register data
          userColl.insertOne({ 'email': email, 'password': hashedPaswrd }, (err, docInserted) => {
            if (err) {
              // if there is error, return it with no record id
              callback(err, null);
            } else {
              // no error to pass. set err to null and pass the record id
              callback(null, docInserted.insertedId);
            }
          });
        } else {
          const err = { 'message': 'email already registered' };
          callback(err);
        }
      })
    },

    checkUser(email, callback) {
      // find the user record using the email
      userColl.find({ 'email': email }).toArray((collErr, coll) => {
        if (collErr) throw collErr;
        callback(null, coll[0]);
      })
    }
  };
}
