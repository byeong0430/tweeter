const attachBtnEvent = () => {
  // event handler for nav button
  $('#nav-bar button').on('click', event => {
    // prevent the default behaviour of the button
    event.preventDefault();
    
    // new tweet container
    const $tweetContainer = $('section.new-tweet');

    // check if the new-tweet section is hidden. if so...
    if ($tweetContainer.css('display') === 'none') {
      // show the section and auto focus the textarea
      $tweetContainer.slideDown('fast');
      $('textarea[name="text"]').focus();
    } else {
      // otherwise, hide it!
      $tweetContainer.slideUp('fast');
    }
  })
};

// you cannot use module.exports in client-side JS. 
// Instead, you can add the loadTweets() method to window to make it available for other js files to import
window.attachBtnEvent = attachBtnEvent;