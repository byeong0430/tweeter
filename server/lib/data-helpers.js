"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db, ObjectId) {
  // 'tweets' collection
  const tweetColl = db.collection("tweets");
  // 'users' collection
  const userColl = db.collection("users");

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
      });
    },

    updateLikes(idSet, callback) {
      // use the unique id to find the data set in mongo db and update the who_liked
      const objId = { _id: ObjectId(idSet.tweetId) };
      tweetColl.find(objId).toArray((collErr, coll) => {
        const doc = coll[0];
        // check if the target tweet is owned by current user
        // if it's not by the current user, enable the like counter
        if (doc.user.user_id === idSet.userId) {
          callback({message: 'You may not like your own tweet'});
        } else {
          // check if you have previously liked the tweet already
          if (doc.who_liked.indexOf(idSet.userId) === -1) {
            // current user have NOT liked the tweet. add the current user to who_liked
            tweetColl.update(objId, { $push: { who_liked: idSet.userId } });
          } else {
            // current user HAVE liked the tweet. remove the current user to who_liked
            tweetColl.update(objId, { $pull: { who_liked: idSet.userId } });
          }
          callback(null, true);
        }
      });
    },

    registerUser(email, hashedPaswrd, callback) {
      // find if there is any duplicate email record
      userColl.find({ email: email }).toArray((collErr, coll) => {
        // return any error from mongodb
        if (collErr) callback(collErr);

        // no duplicate record
        if (coll.length === 0) {
          // insert the user's register data
          const newCredentials = { email: email, password: hashedPaswrd };
          userColl.insertOne(newCredentials, (err, docInserted) => {
            if (err) {
              // if there is error, return it with no record id
              callback(err, null);
            } else {
              // no error to pass. set err to null and pass the record id
              callback(null, docInserted);
            }
          });
        } else {
          const err = { message: "email already registered" };
          callback(err);
        }
      });
    },

    checkUser(email, callback) {
      // find the user record using the email
      userColl.find({ email: email }).toArray((collErr, coll) => {
        const doc = coll[0];
        // check if document exists
        if (doc) {
          callback(null, doc);
        } else {
          const err = { message: "email not found. please register!" };
          callback(err, doc);
        }
      });
    }
  };
};
