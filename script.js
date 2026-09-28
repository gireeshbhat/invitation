const scene = document.querySelector('.invitation-scene');
const openButton = document.querySelector('#open-invitation');
const closeButton = document.querySelector('#close-invitation');
const card = document.querySelector('#invitation-card');
const burst = document.querySelector('#petal-burst');

function openInvitation() {
  scene.classList.add('is-open');
  card.removeAttribute('inert');
  card.setAttribute('aria-hidden', 'false');
  openButton.setAttribute('aria-expanded', 'true');
  openButton.disabled = true;
  card.scrollTop = 0;
  makePetals();
  window.setTimeout(() => closeButton.focus(), 420);
}

function closeInvitation() {
  scene.classList.remove('is-open');
  card.setAttribute('inert', '');
  card.setAttribute('aria-hidden', 'true');
  openButton.setAttribute('aria-expanded', 'false');
  openButton.disabled = false;
  card.scrollTop = 0;
  window.setTimeout(() => openButton.focus(), 420);
}

function makePetals() {
  const colors = ['#d9b795', '#e6d5ad', '#bd8372', '#c0c9a4', '#ece1c8'];
  burst.replaceChildren();
  for (let index = 0; index < 18; index += 1) {
    const petal = document.createElement('span');
    const angle = (360 / 18) * index;
    const distance = 115 + ((index * 37) % 140);
    petal.className = 'petal';
    petal.style.setProperty('--angle', `${angle}deg`);
    petal.style.setProperty('--dx', `${Math.cos((angle * Math.PI) / 180) * distance}px`);
    petal.style.setProperty('--dy', `${Math.sin((angle * Math.PI) / 180) * distance}px`);
    petal.style.setProperty('--delay', `${(index % 6) * 24}ms`);
    petal.style.setProperty('--petal-color', colors[index % colors.length]);
    burst.append(petal);
  }
}

function updateCountdown() {
  const ceremony = new Date('2026-12-10T10:29:00+05:30').getTime();
  const remaining = ceremony - Date.now();
  const countdown = document.querySelector('#countdown');

  if (remaining <= 0) {
    if (!countdown.dataset.completed) {
      countdown.innerHTML = '<p class="countdown-message">The day we have been waiting for is here</p>';
      countdown.dataset.completed = 'true';
    }
    return;
  }

  const units = [
    ['#count-days', Math.floor(remaining / 86400000)],
    ['#count-hours', Math.floor((remaining / 3600000) % 24)],
    ['#count-minutes', Math.floor((remaining / 60000) % 60)],
    ['#count-seconds', Math.floor((remaining / 1000) % 60)],
  ];
  units.forEach(([selector, value]) => {
    document.querySelector(selector).textContent = String(value).padStart(2, '0');
  });
}

openButton.addEventListener('click', openInvitation);
closeButton.addEventListener('click', closeInvitation);
updateCountdown();
window.setInterval(updateCountdown, 1000);

document.querySelector('#share-invitation').addEventListener('click', async () => {
  const status = document.querySelector('#share-status');
  const shareData = {
    title: 'Gireesh & Anjana — Wedding Invitation',
    text: 'Join us to celebrate our wedding on 10 December 2026 and reception on 12 December 2026.',
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      status.textContent = 'Thank you for sharing our invitation.';
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shareData.url);
      status.textContent = 'Invitation link copied.';
    } else {
      status.textContent = 'This invitation is ready to share once it has a public link.';
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      status.textContent = 'This invitation is ready to share once it has a public link.';
    }
  }
});
