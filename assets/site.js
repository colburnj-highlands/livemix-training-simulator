(() => {
  'use strict';
  const config = window.TRAINING_CONFIG;
  const gate = document.querySelector('#gate');
  const site = document.querySelector('#site');
  const input = document.querySelector('#pin');
  const error = document.querySelector('#pin-error');

  document.querySelector('#pin-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!config || !/^[0-9]{4}$/.test(input.value) || input.value !== config.pin) {
      error.textContent = 'That PIN did not match. Please try again.';
      input.setAttribute('aria-invalid', 'true');
      input.select();
      return;
    }
    error.textContent = '';
    input.removeAttribute('aria-invalid');
    input.value = '';
    gate.hidden = true;
    site.hidden = false;
    document.querySelector('#hero-title').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  });

  input.addEventListener('input', () => {
    error.textContent = '';
    input.removeAttribute('aria-invalid');
  });

  document.querySelector('#lock').addEventListener('click', () => {
    site.hidden = true;
    gate.hidden = false;
    input.value = '';
    window.scrollTo(0, 0);
    input.focus();
  });

  if (config?.simulatorEnabled === true) {
    const launch = document.querySelector('#launch');
    launch.href = './simulator/index.html';
    launch.hidden = false;
    document.querySelector('#simulator-status').textContent = 'Ready to practice';
    document.querySelector('#simulator-description').textContent = 'Open the simulator and practice the controls at your own pace.';
    document.querySelector('#launch-note').textContent = 'Practice mixes are stored in this browser.';
  }
})();
