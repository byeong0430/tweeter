// modifyTweets() can post a new tweet AND update like-counter
// noteDom refers to where the warning message will be displayed
const modifyTweets = (reqData, okActionCb, noteDom) => {
  const { alertFunc } = reqData;
  $.ajax({
    url: reqData.url,
    method: reqData.method,
    data: reqData.data
  })
    .done(() => {
      if (alertFunc.enableOkAlert === "y") {
        alertFunc.showFlashMessage(noteDom, "flash-message ok", "Success!");
      }
      // callback when ajax request was successful (i.e. render main page with new tweets from mongo db)
      okActionCb();
    })
    .fail(err => {
      // 400 - 500 error status
      if (alertFunc.enableWarningAlert === "y") {
        alertFunc.showFlashMessage(
          noteDom,
          "flash-message warning",
          err.responseJSON.error
        );
      }
    });
};

// make a group of icons in the footer of each tweet
const makeIconGroup = (...iconNames) => {
  // icons: outcome looks like this: <span class='icon-group'><i class='material-icons'>flag</i></span>
  const $iconGroupSpan = $("<span>").addClass("icon-group");
  // loop through each google icon name to create DOM and append it to span.icon-group
  // also add data attribute called 'id' and give it each tweet object id
  iconNames[0].forEach(name => {
    const $icon = $("<i>")
      .addClass(`material-icons ${name}`)
      .text(name);
    $iconGroupSpan.append($icon);
  });
  return $iconGroupSpan;
};

// use EXTERNAL humanize-duration module to convert unix seconds to human readable time
// this module was imported in <head> of index.html
// reference: https://github.com/EvanHahn/HumanizeDuration.js
const humaniseTime = tweet => {
  const timeDiffInSec = Date.now() - Number(tweet.created_at);
  let stringTime = humanizeDuration(timeDiffInSec, { largest: 1 });
  // replace string float numbers with integers
  return stringTime.replace(/^[+-]?(\d*[.])?\d+/, number => Math.floor(number));
};

// create and display tweets archived in db
const createTweetElement = userTweet => {
  // 1. construct header
  const account = userTweet.user;
  const $header = $("<header>")
    .append(`<img src="${account.avatars.small}"/>`)
    .append($("<h2>").text(account.name))
    .append($("<span>").text(account.handle));

  // 2. construct main and add the tweet content
  const $main = $("<main>").append($("<p>").text(userTweet.content.text));

  // 3. construct footer
  // icon group - add data-id attribute!
  const icons = ["flag", "repeat", "favorite"];
  const $iconGroupSpan = makeIconGroup(icons).attr("data-id", userTweet._id);
  // time of your tweet creation
  const $timeSpan = $("<span>").text(`${humaniseTime(userTweet)} ago`);
  // create a like counter
  let likeMessage = `${userTweet.like_counter} like`;
  // don't show '0 like'
  // if there is more than 1 like, 'like' => 'likes'
  if (userTweet.like_counter > 1) likeMessage += "s";

  const $likeSpan = $("<span>")
    .addClass("like-counter")
    .text(likeMessage);

  // append timeSpan and likeSpan to a new span
  const $footerMessage = $("<span>")
    .append($timeSpan)
    .append($likeSpan);

  // append the two spans (icon-group and tweet time) to <footer>
  const $footer = $("<footer>")
    .append($footerMessage)
    .append($iconGroupSpan);
  // 3. construct footer - end

  // return completed tweeter article
  const $tweetArticle = $("<article>").addClass("tweet");
  return $tweetArticle
    .append($header)
    .append($main)
    .append($footer);
};

const addLikeCount = () => {
  // on click, fav btn should make a post request to /tweets/likes to update the like-counter
  $("#tweets-container i.favorite").on("click", function() {
    // data-id attribute is in its parent DOM
    const $tweetId = $(this)
      .parent()
      .data("id");
    // send an ajax post request to /tweets/likes/. only enable warning alert
    const likeCounterMeta = {
      url: "/tweets/likes",
      method: "POST",
      data: { id: $tweetId },
      alertFunc: {
        enableOkAlert: "n",
        enableWarningAlert: "y",
        showFlashMessage
      }
    };
    const $flashMessageDOM = $(".tweet-message-board .flash-message");
    // count the # of likes
    modifyTweets(likeCounterMeta, showTweets, $flashMessageDOM);
  });
};

// append tweet elements to their container
const renderTweets = tweets => {
  tweets.forEach(tweet => {
    const $tweet = createTweetElement(tweet);
    $("#tweets-container").append($tweet);
  });
  addLikeCount();
};

// bring all tweets from db and render all tweets and display them on the webpage
const loadTweets = tweets => renderTweets(tweets);

// ajax call to get tweet data and load them
const showTweets = () => {
  $.ajax({
    url: "/tweets",
    method: "GET",
    success: result => {
      // check if user's still logged in. if so,
      if (result.isLoggedIn) {
        // configure buttons for logged-in case
        btnWhileLoggedIn();
      } else {
        // configure buttons for logged-out case
        btnAfterLoggedOut();
      }
      // before loading tweets, empty out the tweet container
      $("#tweets-container").empty();
      loadTweets(result.tweets);
    }
  });
};

// show flash messages
// jQuery DOM refers to the element you add the message to
const showFlashMessage = (DOM, newClass, message) => {
  DOM.attr("class", newClass)
    .show()
    .text(message);
};

const processNewTweet = ($form, $messageDOM) => {
  // serialise your form data
  const $serialisedForm = $form.serialize();
  const $tweetPhrase = $serialisedForm.replace("text=", "");
  let warningMessage = "";

  switch (true) {
    case $tweetPhrase.length === 0:
      // fail case: empty content
      warningMessage = "Warning: Your tweet is empty!";
      showFlashMessage($messageDOM, "flash-message warning", warningMessage);
      break;
    case $tweetPhrase.length > 140:
      // fail case: content that's too long
      warningMessage = "Warning: Your tweet is empty!";
      showFlashMessage($messageDOM, "flash-message warning", warningMessage);
      break;
    default:
      // new tweet has no problem & is ready to be uploaded to db
      // make a post request to /tweets. enable both alert and error message alerts
      const ajaxMeta = {
        url: "/tweets",
        method: "POST",
        data: $serialisedForm,
        alertFunc: {
          enableOkAlert: "y",
          enableWarningAlert: "y",
          showFlashMessage
        }
      };
      modifyTweets(ajaxMeta, showTweets, $messageDOM);

      // clear out the textarea
      $form[0].reset();
  }
};

const submitTweet = () => {
  // event handler for on form submission
  const $tweetForm = $(".new-tweet form");
  $tweetForm.on("submit", event => {
    // prevent the default behaviour of the form
    event.preventDefault();
    // flash message
    const $flashMessage = $(".tweet-message-board .flash-message");
    // process the new tweet
    processNewTweet($tweetForm, $flashMessage);
  });
};

// you cannot use module.exports in client-side JS.
// Instead, you can add methods to window to make them available for other js files to import
window.tweetFuncs = {
  showTweets,
  submitTweet,
  showFlashMessage
};
