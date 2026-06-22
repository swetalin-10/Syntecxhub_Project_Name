const slider      = document.getElementById('slider');
const prevBtn     = document.getElementById('prevBtn');
const nextBtn     = document.getElementById('nextBtn');
const dotsEl      = document.getElementById('dots');
const currentNum  = document.getElementById('currentNum');
const autoplayBtn = document.getElementById('autoplayBtn');

const slides = slider.querySelectorAll('.slide');
const total  = slides.length;
let current  = 0;
let playing  = true;
let timer    = null;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  dot.addEventListener('click', () => { goTo(i); resetTimer(); });
  dotsEl.appendChild(dot);
});

function goTo(idx) {
  current = (idx + total) % total;
  slider.style.transform = `translateX(-${current * 100}%)`;
  dotsEl.querySelectorAll('.dot').forEach((d, i) =>
    d.classList.toggle('active', i === current)
  );
  currentNum.textContent = current + 1;
}

function goNext() { goTo(current + 1); }
function goPrev() { goTo(current - 1); }

nextBtn.addEventListener('click', () => { goNext(); resetTimer(); });
prevBtn.addEventListener('click', () => { goPrev(); resetTimer(); });

function startTimer() {
  timer = setInterval(goNext, 3800);
}

function resetTimer() {
  clearInterval(timer);
  if (playing) startTimer();
}

autoplayBtn.addEventListener('click', () => {
  playing = !playing;
  autoplayBtn.innerHTML = playing ? '&#9646;&#9646;' : '&#9654;';
  autoplayBtn.setAttribute('aria-label', playing ? 'Pause autoplay' : 'Start autoplay');
  if (playing) {
    startTimer();
  } else {
    clearInterval(timer);
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  { goPrev(); resetTimer(); }
  if (e.key === 'ArrowRight') { goNext(); resetTimer(); }
});

startTimer();
