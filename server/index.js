"use strict";

// Basic express setup:
const PORT = 8080;
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const { MongoClient, ObjectId } = require('mongodb');
const sassMiddleware = require('node-sass-middleware');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['user_id'],
  maxAge: 24 * 60 * 60 * 1000 //24 hours
}))
app.use(sassMiddleware({
  /* Options */
  src: path.join(__dirname, 'scss'),
  dest: path.join(__dirname, '../public'),
  debug: true,
  // log(severity, key, val) {
  //   console.log(severity, key, val);
  // },
  outputStyle: 'compressed'
}));

app.use(express.static("public"));

// connect to mongo db, tweeter
const url = process.env.MONGODB_URI;
console.log(url);
MongoClient.connect(url, (dbErr, db) => {
  // throw err if there is a problem with db connection
  if (dbErr) throw dbErr;

  // pass the mongo db and ObjectId (required for document searching)
  // to data-helpers and get saveTweet() and getTweets() functions
  const DataHelpers = require("./lib/data-helpers.js")(db, ObjectId);

  // pass the functions defined in DataHelpers to tweet-routes
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);

  app.listen(process.env.PORT || PORT, () => {
    console.log("Example app listening on port " + PORT);
  });
});
