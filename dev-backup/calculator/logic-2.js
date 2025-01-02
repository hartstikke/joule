document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('change', function (event) {
    // Check if the changed element is a radio button inside .calculator_radio-block
    if (
      event.target.type === 'radio' &&
      event.target.closest('.calculator_radio-block')
    ) {
      var radioName = event.target.name;

      // Remove 'checked' class from .calculator_radio-block instances with the same name attribute
      document
        .querySelectorAll(
          '.calculator_radio-block input[type="radio"][name="' +
            radioName +
            '"]'
        )
        .forEach(function (radio) {
          radio.closest('.calculator_radio-block').classList.remove('checked');
        });

      // Add 'checked' class to the label of the checked radio button
      event.target.closest('.calculator_radio-block').classList.add('checked');
    }
  });
});
