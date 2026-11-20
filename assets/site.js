(() => {
  'use strict';
  const input = document.querySelector('#pin');
  const error = document.querySelector('#pin-error');

  document.querySelector('#pin-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!/^[0-9]{4}$/.test(input.value) || input.value !== window.TRAINING_CONFIG?.pin) {
      error.textContent = 'That PIN did not match. Please try again.';
      input.setAttribute('aria-invalid', 'true');
      input.select();
      return;
    }
    input.value = '';
    window.location.assign('./simulator/index.html');
  });

  input.addEventListener('input', () => {
    error.textContent = '';
    input.removeAttribute('aria-invalid');
  });
})();
