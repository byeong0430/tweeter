"use strict";

const { MongoClient } = require("mongodb");
// 'tweeter': database name
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

MongoClient.connect(MONGODB_URI, (dbErr, db) => {
  if (dbErr) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw dbErr;
  }

  // ==> We have a connection to the "test-tweets" db,
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  const showTweet = (err, tweets) => {
    if (err) {
      console.error("Failed to connect to 'tweets' collection");
      throw err;
    }
    console.log('Logging each tweet:');
    for (let tweet of tweets) {
      console.log(tweet);
    }
    db.close();
  };

  // 'tweets': collection name
  const getTweets = () => db.collection('tweets').find().toArray(showTweet);
  getTweets();
});