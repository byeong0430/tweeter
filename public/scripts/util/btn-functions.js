// navbar button config when logged out
const btnAfterLoggedOut = () => {
  // hide the login/signup section and button
  $('#login-signup-btn').show();
  // show the logout button
  $('#logout-btn').hide();
};

// navbar button config while logged in
const btnWhileLoggedIn = () => {
  // hide the login/signup section and button
  $('section.login-signup').hide();
  $('#login-signup-btn').hide();
  // show the logout button
  $('#logout-btn').show();
};

const logout = () => {
  $('#logout-btn').on('click', function (event) {
    event.preventDefault;
    $.ajax({
      url: '/tweets/logout',
      method: 'GET',
      success: () => btnAfterLoggedOut()
    })
  })
};

// actions to take when verification was successful
const verificationSuccess = ($form, success) => {
  // remove all input field values
  $form[0].reset();

  // if login credentials are verified, add a welcome message on nav bar
  $('#nav-bar .welcome-message').text(`Welcome, ${success.email}!`);
  $('section.tweet-message-board .flash-message').hide();
  // configure the navbar button for when user's logged in 
  btnWhileLoggedIn();
};

// display error message when login/signup failed
const verificationErr = error => {
  const $flashMessage = $('.login-signup .flash-message');
  const errJSON = error.responseJSON;
  showFlashMessage($flashMessage, 'flash-message warning', errJSON.error);
};

const submitVerification = ($submitForm) => {
  $('section.login-signup form').on('submit', function (event) {
    event.preventDefault();
    const $formAction = $submitForm.attr('action');
    
    $.ajax({
      url: $formAction,
      method: 'POST',
      data: $submitForm.serialize(),
      success: verifiedResult => verificationSuccess($submitForm, verifiedResult),
      error: err => verificationErr(err)
    })
  })
};

const setupVerificationForm = () => {
  const $parentSection = $('section.login-signup');
  const $form = $parentSection.find('form');

  // add event on login & signup forms
  submitVerification($form);

  // add event handle to the logout button
  logout();

  // this allows us to switch back and forth between login and signup forms
  // note: default is login form
  $('section.login-signup a').on('click', function () {
    // if data-type is login, meaning the login form is displayed..
    if ($parentSection.attr('data-type') === 'login') {
      // convert the login form to signup form
      $parentSection.find('h2').text('Sign up');
      $parentSection.attr('data-type', 'signup');
      $form.attr('action', '/tweets/signup');
      $(this).text('log in now');
    } else {
      // convert the singup form to login form
      $parentSection.find('h2').text('Log in');
      $parentSection.attr('data-type', 'login');
      $form.attr('action', '/tweets/login');
      $(this).text('sign up now');
    }
    // hide any activated warning message 
    $parentSection.find('.flash-message').hide();
  })
};

const focusText = () => {
  $('textarea[name="text"]').focus();
};

const attachBtnEvent = ($btn, $target, cb) => {
  // on button click
  $btn.on('click', event => {
    // prevent the default behaviour of the button
    event.preventDefault();

    // check if the target is hidden. if so...
    if ($target.css('display') === 'none') {
      // show the target and auto focus the textarea
      $target.slideDown('fast');
      if (cb) cb();
    } else {
      // otherwise, hide it!
      $target.slideUp('fast');
    }
  })
};


// you cannot use module.exports in client-side JS. 
// Instead, you can add the loadTweets() method to window to make it available for other js files to import
window.btnEvents = {
  setupVerificationForm,
  focusText,
  attachBtnEvent
};