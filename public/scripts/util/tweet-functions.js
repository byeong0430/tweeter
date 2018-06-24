// sendAjaxReq() can post a new tweet AND update like-counter
const sendAjaxReq = (reqData, okActionCb, noteDom) => {
  const { alertFunc } = reqData;
  $.ajax({
    url: reqData.url,
    method: reqData.method,
    data: reqData.data
  }).done(() => {
    if (alertFunc.enableOkAlert === 'y') {
      alertFunc.showFlashMessage(noteDom, 'flash-message ok', 'Success!');
    }
    // get the tweet db again
    okActionCb();
  }).fail(err => {
    // fail case 3: 400 ~ 500 errors?
    if (alertFunc.enableWarningAlert === 'y') {
      alertFunc.showFlashMessage(noteDom, 'flash-message warning', err.responseJSON.error);
    }
  });
};

const makeIconGroup = (...iconNames) => {
  // icons: outcome looks like this: <span class='icon-group'><i class='material-icons'>flag</i></span> 
  const $iconGroupSpan = $('<span>').addClass('icon-group');
  // loop through each google icon name to create DOM and append it to span.icon-group
  // also add data attribute called id and give it each tweet object id
  iconNames[0].forEach(name => {
    let $icon = $('<i>').addClass(`material-icons ${name}`).text(name);
    $iconGroupSpan.append($icon);
  });
  return $iconGroupSpan;
};

const humaniseTime = (tweet) => {
  const timeDiffInSec = (Date.now() - Number(tweet.created_at));
  // use EXTERNAL humanize-duration module to convert seconds to human readable time
  // this module was imported in <head> of index.html
  let stringTime = humanizeDuration(timeDiffInSec, { largest: 1 });

  // replace string float numbers with integers
  return stringTime.replace(/^[+-]?(\d*[.])?\d+/, number => Math.floor(number));
};

// create db tweet displays
const createTweetElement = userTweet => {
  // 1. construct header
  const account = userTweet.user;
  const $header = $('<header>')
    .append(`<img src="${account.avatars.small}"/>`)
    .append($('<h2>').text(account.name))
    .append($('<span>').text(account.handle));

  // 2. construct main
  const $main = $('<main>').append($('<p>').text(userTweet.content.text));

  // 3. construct footer
  // icon group - add data-id attribute!
  const $iconGroupSpan = makeIconGroup(['flag', 'repeat', 'favorite']).attr('data-id', userTweet._id);
  // time of your tweet creation
  const $timeSpan = $('<span>').text(`${humaniseTime(userTweet)} ago`);
  // create a like counter
  let likeMessage = `${userTweet.like_counter} like`;
  // if there is 0 like, remove the message. 
  // if there is more than 1 like, make 'like' plural
  if (userTweet.like_counter > 1) {
    likeMessage += 's';
  }
  const $likeSpan = $('<span>').addClass('like-counter').text(likeMessage);

  // append timeSpan and likeSpan to a new span
  const $footerMessage = $('<span>').append($timeSpan).append($likeSpan);

  // append the two spans (icon-group and tweet time) to <footer>
  const $footer = $('<footer>').append($footerMessage).append($iconGroupSpan);
  // 3. construct footer - end

  // tweeter article
  const $tweetArticle = $('<article>').addClass('tweet');
  return $tweetArticle.append($header).append($main).append($footer);
};

const addLikeCount = () => {
  // on click, fav btn should make a post request to /tweets/likes to update the like-counter
  $('#tweets-container i.favorite').on('click', function () {
    // data-id attribute is in the parent DOM
    const $tweetId = $(this).parent().data('id');
    // send an ajax post request to /tweets/likes/. only enable warning alert
    const ajaxMeta = {
      url: '/tweets/likes',
      method: 'POST',
      data: { 'id': $tweetId },
      alertFunc: {
        'enableOkAlert': 'n',
        'enableWarningAlert': 'y',
        showFlashMessage
      }
    };
    sendAjaxReq(ajaxMeta, showTweets, $('.tweet-message-board .flash-message'));
  })
};

// append tweet elements to their container
const renderTweets = tweets => {
  tweets.forEach(tweet => {
    const $tweet = createTweetElement(tweet);
    $('#tweets-container').append($tweet);
  });

  addLikeCount();
};

// bring all tweets from mongo db
const loadTweets = tweets => {
  // render all tweets and display them on the webpage
  renderTweets(tweets);
};

// ajax call to get tweet data and load them
const showTweets = () => {
  $.ajax({
    url: '/tweets',
    method: 'GET',
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
      $('#tweets-container').empty();
      loadTweets(result.tweets);
    }
  });
};

// show flash messages
// jQuery DOM refers to the element you add the message to
const showFlashMessage = (DOM, newClass, message) => DOM.attr('class', newClass).show().text(message);

const processNewTweet = (form, message) => {
  const $tweetPhrase = form.replace('text=', '');

  switch (true) {
    case ($tweetPhrase.length === 0):
      // fail case: empty content
      showFlashMessage(message, 'flash-message warning', 'Warning: Your tweet is empty!');
      break;
    case ($tweetPhrase.length > 140):
      // fail case: content that's too long
      showFlashMessage(message, 'flash-message warning', 'Warning: Your tweet is too long!');
      break;
    default:
      // make a post request to /tweets. enable both alert and error message alerts
      const ajaxMeta = {
        url: '/tweets',
        method: 'POST',
        data: form,
        alertFunc: {
          'enableOkAlert': 'y',
          'enableWarningAlert': 'y',
          showFlashMessage
        }
      };
      sendAjaxReq(ajaxMeta, showTweets, message);
  }
};

const submitTweet = () => {
  // event handler for on form submission
  const $tweetForm = $('.new-tweet form');
  $tweetForm.on('submit', event => {
    // prevent the default behaviour of the form
    event.preventDefault();
    // serialise your form data
    const $serialisedForm = $tweetForm.serialize();
    // flash message
    const $flashMessage = $('.tweet-message-board .flash-message');

    // process the new tweet
    processNewTweet($serialisedForm, $flashMessage);
  });
};

// you cannot use module.exports in client-side JS. 
// Instead, you can add the loadTweets() method to window to make it available for other js files to import
window.tweetFuncs = {
  showTweets,
  submitTweet,
  showFlashMessage
};
