// $(document).ready can be shortened to $. 
// there is no `this` in the document scope so `=>` is allowed
$(() => {
  // destructure window.tweetFuncs
  const { showTweets, submitTweet } = window.tweetFuncs;
  const { setupVerificationForm, focusText, attachBtnEvent } = window.btnEvents;
  // use ajax to load all tweets in mongo db.
  showTweets();

  // this function allows us to change the log in form into a sign up form or vice versa
  // so that we don't have to make two almost exact same form copies
  setupVerificationForm();

  // attach click event handler to nav LOGIN button
  attachBtnEvent($('#login-signup-btn'), $('section.login-signup'));

  // attach click event handler to nav COMPOSE button
  attachBtnEvent($('#compose-btn'), $('section.new-tweet'), focusText);

  // submit tweet
  submitTweet();
});


