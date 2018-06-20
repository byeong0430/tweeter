const createTweetElement = userTweet => {
  // 1. construct header
  const $header = $('<header>')
    .append(`<img src="${userTweet.user.avatars.small}"/>`)
    .append($('<h2>').text(userTweet.user.name))
    .append($('<span>').text(userTweet.user.handle));

  // 2. construct main
  const $main = $('<main>').append($('<p>').text(userTweet.content.text));

  // 3. construct footer
  // 3.1 icons
  // outcome looks like this: <span class='icon-group'><i class='material-icons'>flag</i></span> 
  const $iconGroupSpan = $('<span>').addClass('icon-group');

  // loop through each google icon name to create DOM and append it to span.icon-group
  ['flag', 'repeat', 'favorite'].forEach(name => {
    const $icon = $('<i>').addClass('material-icons').text(name);
    $iconGroupSpan.append($icon);
  });
  // 3.1 icons - end

  // 3.2 time of your tweet creation
  const timeDiffInSec = (Date.now() - Number(userTweet.created_at)) / 1000;
  // use EXTERNAL humanize-duration module to convert seconds to human readable time
  // this module was imported in <head> of index.html
  let humanTime = humanizeDuration(timeDiffInSec, { largest: 1 });
  // replace string float numbers with integers
  humanTime = humanTime.replace(/^[+-]?(\d*[.])?\d+/, number => Math.floor(number));
  // 3.2 time of your tweet creation - end

  // append the two spans (icon-group and tweet time) to <footer>
  const $footer = $('<footer>')
    .append($('<span>').text(`${humanTime} ago`))
    .append($iconGroupSpan);
  // 3. construct footer - end

  return $('<article>').addClass('tweet').append($header).append($main).append($footer);
};

const renderTweets = tweets => {
  tweets.forEach(tweet => {
    const $tweet = createTweetElement(tweet);
    $('#tweets-container').append($tweet);
  });
};

const loadTweets = tweets => {
  // render all tweets and display them on the webpage
  renderTweets(tweets);
}

// you cannot use module.exports in client-side JS. 
// Instead, you can add the loadTweets() method to window to make it available for other js files to import
window.loadTweets = loadTweets;
