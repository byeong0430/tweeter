const makeIconGroup = (tweetData, ...iconNames) => {
  // icons: outcome looks like this: <span class='icon-group'><i class='material-icons'>flag</i></span> 
  const $iconGroupSpan = $('<span>').addClass('icon-group');
  // loop through each google icon name to create DOM and append it to span.icon-group
  iconNames[0].forEach(name => {
    let $icon = $('<i>').addClass(`material-icons ${name}`).text(name);
    if (name === 'favorite') {
      // add each tweet's id to the anchor tag
      $icon = $(`<a href=/tweets/likes/${tweetData._id}/>`).append($icon);
    }
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
  // icon group
  const $iconGroupSpan = makeIconGroup(userTweet, ['flag', 'repeat', 'favorite']);
  // time of your tweet creation
  const $timeSpan = $('<span>').text(`${humaniseTime(userTweet)} ago`);
  // create a like counter
  let likeMessage = (userTweet.like_counter === 0) ? '' : `${userTweet.like_counter} like`;
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

// append tweet elements to their container
const renderTweets = tweets => {
  tweets.forEach(tweet => {
    const $tweet = createTweetElement(tweet);
    $('#tweets-container').append($tweet);
  });
};

// bring all tweets from mongo db
const loadTweets = tweets => {
  // render all tweets and display them on the webpage
  renderTweets(tweets);
}

// post tweets
// parameters: jQuery serialised form flash message
const postTweet = (serialisedForm, message) => {
  $.ajax({
    url: '/tweets',
    method: 'POST',
    data: serialisedForm,
    success: () => {
      // tweet db successfully updated!
      // display success message (change class name to 'flash-message ok' to apply appropriate css rules)
      showFlashMessage(message, 'flash-message ok', 'Success!');
      // get the tweet db again
      showTweets();
    },
    error: (xhr, err, errText) => {
      // fail case 3: 400 ~ 500 errors?
      const errMessage = `${err} ${xhr.status}: ${errText}`;
      showFlashMessage(message, 'flash-message warning', errMessage);
    }
  });
};

// ajax call to get tweet data and load them
const showTweets = () => {
  $.ajax({
    url: '/tweets',
    method: 'GET',
    success: tweets => {
      // before loading tweets, empty out the tweet container
      $('#tweets-container').empty();
      loadTweets(tweets);
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
      // if there is no problem with the input data, serialise it!
      postTweet(form, message);
  }
};

// you cannot use module.exports in client-side JS. 
// Instead, you can add the loadTweets() method to window to make it available for other js files to import
window.tweetFuncs = {
  processNewTweet,
  showTweets
};
