const questions = [
  {
    q: "What does HTML stand for?",
    options: ["Hyper Transfer Markup Language", "Hyper Text Markup Language", "High Technical Machine Language", "Hyper Text Machine Language"],
    answer: 1
  },
  {
    q: "Which CSS property changes the background color of an element?",
    options: ["color", "bgcolor", "background-color", "bg-color"],
    answer: 2
  },
  {
    q: "Which JavaScript method adds an element to the end of an array?",
    options: ["append()", "add()", "insert()", "push()"],
    answer: 3
  },
  {
    q: "What does CSS stand for?",
    options: ["Creative Style Sheets", "Computer Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
    answer: 2
  },
  {
    q: "Which HTML tag is used to define a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    answer: 1
  },
  {
    q: "Which JavaScript method removes the last element from an array?",
    options: ["remove()", "splice()", "delete()", "pop()"],
    answer: 3
  },
  {
    q: "What is the default display value of a <div> element?",
    options: ["inline", "flex", "inline-block", "block"],
    answer: 3
  },
  {
    q: "Which CSS property controls the size of the text?",
    options: ["text-size", "font-style", "text-style", "font-size"],
    answer: 3
  },
  {
    q: "Which event fires when a user clicks on an HTML element?",
    options: ["onmouseup", "onfocus", "onchange", "onclick"],
    answer: 3
  },
  {
    q: "Which symbol is used for single-line comments in JavaScript?",
    options: ["<!-- -->", "#", "//", "/* */"],
    answer: 2
  }
];

const letters = ['A', 'B', 'C', 'D'];

let current      = 0;
let score        = 0;
let answered     = false;
let correctCount = 0;
let wrongCount   = 0;

const questionNumEl  = document.getElementById('questionNum');
const questionTextEl = document.getElementById('questionText');
const optionsList    = document.getElementById('optionsList');
const nextBtn        = document.getElementById('nextBtn');
const liveScore      = document.getElementById('liveScore');
const progressFill   = document.getElementById('progressFill');
const progressText   = document.getElementById('progressText');
const quizCard       = document.getElementById('quizCard');
const resultCard     = document.getElementById('resultCard');
const restartBtn     = document.getElementById('restartBtn');

function loadQuestion() {
  answered = false;
  nextBtn.disabled = true;
  nextBtn.textContent = current === questions.length - 1 ? 'Submit ✓' : 'Next →';

  const q = questions[current];
  questionNumEl.textContent  = `Question ${current + 1}`;
  questionTextEl.textContent = q.q;

  const pct = ((current + 1) / questions.length) * 100;
  progressFill.style.width   = pct + '%';
  progressText.textContent   = `${current + 1} / ${questions.length}`;

  optionsList.innerHTML = '';
  q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'option';
    div.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${opt}</span>`;
    div.addEventListener('click', () => selectOption(div, i));
    optionsList.appendChild(div);
  });

  quizCard.style.animation = 'none';
  requestAnimationFrame(() => { quizCard.style.animation = 'fadeIn .3s ease'; });
}

function selectOption(el, idx) {
  if (answered) return;
  answered = true;
  nextBtn.disabled = false;

  const q    = questions[current];
  const opts = optionsList.querySelectorAll('.option');
  opts.forEach(o => o.classList.add('locked'));
  el.classList.add('selected');

  if (idx === q.answer) {
    el.classList.add('correct');
    score++;
    correctCount++;
    liveScore.textContent = score;
  } else {
    el.classList.add('wrong');
    wrongCount++;
    opts[q.answer].classList.add('correct');
  }
}

nextBtn.addEventListener('click', () => {
  current++;
  if (current >= questions.length) {
    showResult();
  } else {
    loadQuestion();
  }
});

function showResult() {
  quizCard.classList.add('hidden');
  resultCard.classList.remove('hidden');

  const pct = Math.round((score / questions.length) * 100);
  let icon, title, msg;

  if (pct === 100) {
    icon = '🏆'; title = 'Perfect Score!';
    msg = "Flawless. You nailed every single question.";
  } else if (pct >= 70) {
    icon = '🎉'; title = 'Great Job!';
    msg = "Solid performance. A little more practice and you'll ace it.";
  } else if (pct >= 40) {
    icon = '📚'; title = 'Keep Going!';
    msg = "Good effort. Review the topics and give it another shot.";
  } else {
    icon = '💪'; title = 'Try Again!';
    msg = "Don't give up — every attempt makes you better.";
  }

  document.getElementById('resultIcon').textContent  = icon;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultScore').textContent = `${score} / ${questions.length}`;
  document.getElementById('resultMsg').textContent   = msg;
  document.getElementById('resultBreakdown').innerHTML = `
    <div class="breakdown-item">
      <span class="correct-count">${correctCount}</span>
      <small>Correct</small>
    </div>
    <div class="breakdown-item">
      <span class="wrong-count">${wrongCount}</span>
      <small>Wrong</small>
    </div>
    <div class="breakdown-item">
      <span>${pct}%</span>
      <small>Score</small>
    </div>
  `;
}

restartBtn.addEventListener('click', () => {
  current      = 0;
  score        = 0;
  correctCount = 0;
  wrongCount   = 0;
  liveScore.textContent = 0;
  quizCard.classList.remove('hidden');
  resultCard.classList.add('hidden');
  loadQuestion();
});

loadQuestion();
