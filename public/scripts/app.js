/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function () {
  // click on the nav button
  $('#nav-bar button').on('click', event => {
    // prevent the default behaviour of the button
    event.preventDefault;
    // check if the new-tweet section is hidden. if so...
    if ($('section.new-tweet').css('display') === 'none') {
      // show the section and auto focus the textarea
      $('section.new-tweet').slideDown('fast');
      $('textarea[name="text"]').focus();
    } else {
      // otherwise, hide it!
      $('section.new-tweet').slideUp('fast');
    }
  })

  // use ajax to make a get request to '/tweets'. This route is defined in the server-side express web-server
  $.ajax({
    url: '/tweets',
    method: 'GET',
    success: tweets => loadTweets(tweets)
  });

  // on button click
  $('.new-tweet input[type="submit"]').on('click', event => {
    // prevent the default behaviour of the form
    event.preventDefault();
    // your text input
    const $tweetPhrase = $('textarea[name="text"]').val();

    if (!$tweetPhrase) {
      // process: set class name to 'flash-message warning (or ok)' to apply correct css rules
      // then show the message with your text.
      // fail case 1: empty content
      $('.new-tweet .flash-message').attr('class', 'flash-message warning')
        .show().text('Warning: Your tweet is empty!');
    } else if ($tweetPhrase.length > 140) {
      // fail case 2: content that's too long
      $('.new-tweet .flash-message').attr('class', 'flash-message warning')
        .show().text('Warning: Your tweet is too long!');
    } else {
      // if there is problem with the input data, serialise it!
      const $formData = $('.new-tweet form').serialize();
      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: $formData
      }).done(() => {
        // tweet db successfully updated!
        // display success message (change class name to 'flash-message ok' to apply appropriate css rules)
        $('.new-tweet .flash-message').attr('class', 'flash-message ok')
          .show().text('Success!');

        // get the tweet db, empty the tweet container and load the data again
        $.ajax({
          url: '/tweets',
          method: 'GET',
          success: tweets => {
            $('#tweets-container').empty();
            loadTweets(tweets);
          }
        });
      }).fail((xhr, err, errMessage) => {
        // fail case 3: 400 ~ 500 errors?
        $('.new-tweet .flash-message').attr('class', 'flash-message warning').
          show().text(`${err} ${xhr.status}: ${errMessage}`);
      });
    }
  });

});


