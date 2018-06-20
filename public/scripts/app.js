/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


// Fake data taken from tweets.json
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];


const createTweetElement = userTweet => {
  // header
  const $header = $('<header>')
    .append(`<img src="${userTweet.user.avatars.small}"/>`)
    .append(`<h2>${userTweet.user.name}</h2>`)
    .append(`<span>${userTweet.user.handle}</span>`);

  // main
  const $main = $('<main>').append(`<p>${userTweet.content.text}</p>`);

  // footer
  // append icons to span.icon-group
  const iconName = ['flag', 'repeat', 'favorite'];
  const $iconGroupSpan = $('<span>').addClass('icon-group');

  iconName.forEach(name => {
    const $icon = $('<i>').addClass('material-icons').append(name);
    $iconGroupSpan.append($icon);
  });

  const timeDiffInSec = (Date.now() - Number(userTweet.created_at)) / 1000;
  // convert seconds to human readable time
  const humanTime = humanizeDuration(timeDiffInSec, { largest: 1 })

  // append the two spans to <footer>
  const $footer = $('<footer>')
    .append(`<span>${humanTime} ago</span>`)
    .append($iconGroupSpan);
  // footer - end

  return $('<article>').addClass('tweet').append($header).append($main).append($footer);
};

const renderTweets = tweets => {
  tweets.forEach(tweet => {
    const $tweet = createTweetElement(tweet);
    $('#tweets-container').append($tweet);
  });
};

$(document).ready(function () {
  // get the db-tweet section by its id
  const tweArchive = $('#tweets-container');
  renderTweets(data);
});


