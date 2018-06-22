// $(document).ready can be shortened to $. 
// there is no `this` in the document scope so `=>` is allowed
$(() => {
  // destructure window.tweetFuncs
  const { showTweets, processNewTweet } = window.tweetFuncs;

  // use ajax to load all tweets in mongo db.
  showTweets();

  // attach click event handler to nav button
  attachBtnEvent();

  // event handler for on form submission
  const $tweetForm = $('.new-tweet form');
  $tweetForm.on('submit', event => {
    // prevent the default behaviour of the form
    event.preventDefault();
    // serialise your form data
    const $serialisedForm = $tweetForm.serialize();
    // flash message
    const $flashMessage = $('.new-tweet .flash-message');

    // process the new tweet
    processNewTweet($serialisedForm, $flashMessage);
  });
});


