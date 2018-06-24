// navbar button config while logged IN
const btnWhileLoggedIn = () => {
  // show the logout button
  $("#logout-btn").show();
  // hide the login/signup section and button
  $("#login-signup-btn").hide();
  $("section.login-signup").hide();
};

// navbar button config when logged OUT
const btnAfterLoggedOut = () => {
  // show the logout button
  $("#logout-btn").hide();
  // then hide the login/signup section and button
  $("#login-signup-btn").show();
  // render the form as a login form
  showLoginForm($("section.login-signup"), $("section.login-signup a"));
};

// add event listener to the logout btn
const logout = () => {
  $("#logout-btn").on("click", function(event) {
    event.preventDefault;
    $.ajax({
      url: "/tweets/logout",
      method: "GET",
      success: () => btnAfterLoggedOut()
    });
  });
};

// actions to take when user verification was successful
const verificationSuccess = ($form, success) => {
  // reset the login/signup form
  $form[0].reset();

  // if login credentials were verified, add a welcome message on nav bar
  $("#nav-bar .welcome-message").text(`Welcome, ${success.email}!`);
  // hide any warning message that may have been displayed before logging in (e.g. clicking on 'like' btn before logging in)
  $("section.tweet-message-board .flash-message").hide();
  // configure the navbar button for when user's logged in
  btnWhileLoggedIn();
};

// display error message when login/signup failed
const verificationErr = err => {
  // show the warning within the login/signup section
  const $flashMessage = $(".login-signup .flash-message");
  const errMessage = err.responseJSON.error;
  showFlashMessage($flashMessage, "flash-message warning", errMessage);
};

// submit either login or signup form
const submitVerification = $submitForm => {
  $("section.login-signup form").on("submit", function(event) {
    event.preventDefault();
    // form's action attr = ajax url
    $.ajax({
      url: $submitForm.attr("action"),
      method: "POST",
      data: $submitForm.serialize(),
      success: verifiResult => verificationSuccess($submitForm, verifiResult),
      error: err => verificationErr(err)
    });
  });
};

// prepare login form
const showSignUpForm = ($section, $a) => {
  const $form = $section.find("form");
  // convert the login form to signup form
  $section.find("h2").text("Sign up");
  $section.attr("data-type", "signup");
  $form.attr("action", "/tweets/signup");
  // anchor tag message. the form is no longer a login form!
  $a.text("log in now");
};

// prepare signup form
const showLoginForm = ($section, $a) => {
  const $form = $section.find("form");
  // convert the singup form to login form
  $section.find("h2").text("Log in");
  $section.attr("data-type", "login");
  $form.attr("action", "/tweets/login");
  $a.text("sign up now");
};

// this allows us to switch back and forth between login and signup forms
// note: default is login form
const switchVerifiForm = $formSection => {
  // click event handler on anchor tag in the footer
  const $form = $formSection.find("form");
  const $anchor = $("section.login-signup a");
  $anchor.on("click", function() {
    // if data-type is login (default setting), meaning the login form is displayed..
    if ($formSection.attr("data-type") === "login") {
      // change it to a signup form
      showSignUpForm($formSection, $anchor);
    } else {
      // change it to a login form
      showLoginForm($formSection, $anchor);
    }
    // hide any activated warning message because that applies to the previous form before switching
    $formSection.find(".flash-message").hide();
    // refresh form inputs
    $form[0].reset();
  });
};

// set up the login/signup form upon displaying the app
const setupVerificationForm = () => {
  const $parentSection = $("section.login-signup");

  switchVerifiForm($parentSection);

  // add event on login & signup forms
  submitVerification($parentSection.find("form"));

  // in case user refreshes the webpage, add event handle to the logout button
  logout();
};

// auto-focus textarea when it's displayed
const focusText = () => $('textarea[name="text"]').focus();

const attachBtnEvent = ($btn, $target, cb) => {
  // on button click
  $btn.on("click", event => {
    // prevent the default behaviour of the button
    event.preventDefault();

    // check if the target is hidden. if so...
    if ($target.css("display") === "none") {
      // show the target
      $target.slideDown("fast");
      // this callback is for the tweet textarea's auto-focus
      if (cb) cb();
    } else {
      // otherwise, hide it!
      $target.slideUp("fast");
    }
  });
};

// you cannot use module.exports in client-side JS.
// Instead, you can add methods to window to make them available for other js files to import
window.btnEvents = {
  setupVerificationForm,
  focusText,
  attachBtnEvent
};
