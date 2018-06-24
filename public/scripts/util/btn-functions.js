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

// this allows us to switch back and forth between login and signup forms
// note: default is login form
const switchVerifiForm = ($formSection, $form) => {
  // click event handler on anchor tag in the footer
  $("section.login-signup a").on("click", function() {
    // if data-type is login (default setting), meaning the login form is displayed..
    if ($formSection.attr("data-type") === "login") {
      // convert the login form to signup form
      $formSection.find("h2").text("Sign up");
      $formSection.attr("data-type", "signup");
      $form.attr("action", "/tweets/signup");
      // $(this) refers to anchor tag message. the form is no longer a login form!
      $(this).text("log in now");
    } else {
      // convert the singup form to login form
      $formSection.find("h2").text("Log in");
      $formSection.attr("data-type", "login");
      $form.attr("action", "/tweets/login");
      $(this).text("sign up now");
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
  const $form = $parentSection.find("form");

  switchVerifiForm($parentSection, $form);

  // add event on login & signup forms
  submitVerification($form);

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
