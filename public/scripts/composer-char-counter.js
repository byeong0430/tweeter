$(document).ready(function () {
  const textArea = $('textarea[name="text"]');
  const charCounter = $('span.counter')[0];

  // get the maximum number of characters allowed
  const charMaxLen = charCounter.innerHTML;

  // on keyup, subtract the # of chars from the total # allowed.
  textArea.on('keyup', function () {
    // `this` refers to textArea.
    const numCharLeft = charMaxLen - $(this).val().length;
    // update the counter
    charCounter.innerHTML = numCharLeft;
    // if the number of characters exceeded, change the font color to red
    if (numCharLeft <= 0) {
      charCounter.style.color = 'red';
    }
  });
});