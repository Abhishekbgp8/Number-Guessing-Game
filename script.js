// Simple Number Guessing Game Implementation (UI for numbergames.py)

// UI elements
const playBtn = document.getElementById('playBtn');
const difficultyBtn = document.getElementById('difficultyBtn');
const quitBtn = document.getElementById('quitBtn');
const menuView = document.getElementById('menu');
const difficultyView = document.getElementById('difficultyView');
const gameView = document.getElementById('gameView');
const resultView = document.getElementById('resultView');

const playAgainBtn = document.getElementById('playAgain');
const backToMenuBtn = document.getElementById('backToMenu');
const submitGuess = document.getElementById('submitGuess');
const guessInput = document.getElementById('guessInput');
const messageEl = document.getElementById('message');
const timerEl = document.getElementById('timer');
const triesEl = document.getElementById('tries');
const rangeText = document.getElementById('rangeText');
const currentRangeDisplay = document.getElementById('currentRange');
const saveDifficulty = document.getElementById('saveDifficulty');
const cancelDifficulty = document.getElementById('cancelDifficulty');
const newGameBtn = document.getElementById('newGameBtn');
const goMenuBtn = document.getElementById('goMenuBtn');
const resultText = document.getElementById('resultText');
const confetti = document.getElementById('confetti');
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
const scoreboardList = document.getElementById('scoreboardList');
const resetScoresBtn = document.getElementById('resetScores');
const themeToggle = document.getElementById('themeToggle');
// guess history removed per user request
const proximityFill = document.querySelector('.proximity .fill');
const proximityText = document.querySelector('.proximity-text');
const bestScoreText = document.getElementById('bestScoreText');

let settings = { theme: 'dark' };
let bestScores = { easy: null, medium: null, hard: null };

let rangeStart = 1, rangeEnd = 50; // default (medium)
let randomNumber = null;
let attempts = 0;
let startTime = null;
let timerInterval = null;

function showView(id) {
  [menuView, difficultyView, gameView, resultView].forEach(v => v.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function updateRangeText() {
  const label = (rangeEnd === 20) ? 'Easy' : (rangeEnd === 50) ? 'Medium' : 'Hard';
  rangeText.textContent = `${rangeStart} - ${rangeEnd}`;
  currentRangeDisplay.textContent = `${rangeStart} - ${rangeEnd} (${label})`;
}

function setDifficulty(level) {
  if (level === 'easy') { rangeEnd = 20; }
  else if (level === 'medium') { rangeEnd = 50; }
  else if (level === 'hard') { rangeEnd = 100; }
  // rangeStart remains 1 in the python code
  updateRangeText();
}

function startTimer() {
  startTime = Date.now();
  timerEl.textContent = '0s';
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    timerEl.textContent = `${seconds}s`;
  }, 250);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function startGame() {
  randomNumber = Math.floor(Math.random() * (rangeEnd - rangeStart + 1)) + rangeStart;
  attempts = 0;
  triesEl.textContent = attempts;
  messageEl.textContent = 'Good luck!';
  messageEl.classList.remove('success','error');
  guessInput.value = '';
  guessInput.disabled = false;
  submitGuess.disabled = false;
  confetti.classList.add('hidden');
  // no guess history to clear
  startTimer();
  showView('gameView');
  guessInput.focus();
  // animate card slightly
  const card = document.querySelector('.card');
  card.classList.add('pulse');
  setTimeout(()=>card.classList.remove('pulse'),780);
}

function endGame(success) {
  stopTimer();
  guessInput.disabled = true;
  submitGuess.disabled = true;
  if (success) {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    resultText.textContent = `Congrats, you guessed the number in ${elapsed} seconds and ${attempts} ${attempts === 1 ? 'try' : 'tries'}.`;
    confetti.classList.remove('hidden');
    // small celebration animation
    confettiAnimate();
    updateBestScore();
    showView('resultView');
  } else {
    showView('menu');
  }
}

function confettiAnimate(){
  // generate many confetti pieces with random colors and positions
  confetti.innerHTML = '';
  const colors = ['#ff7b8b','#ffd166','#7ee5ff','#b8a2ff','#a0f0a1','#ffd9a8'];
  const total = 28;
  for (let i = 0; i < total; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 92}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.opacity = '1';
    piece.style.transform = `translateY(0) rotate(${Math.random() * 360}deg)`;
    piece.style.animationDelay = `${Math.random() * 140}ms`;
    piece.style.animationDuration = `${900 + Math.random() * 800}ms`;
    confetti.appendChild(piece);
  }
  confetti.classList.remove('hidden');
  setTimeout(()=>{ confetti.classList.add('hidden'); confetti.innerHTML = ''; }, 2200);
}

function submit() {
  const val = guessInput.value.trim();
  const num = parseInt(val, 10);
  if (!val || Number.isNaN(num)) {
    messageEl.textContent = 'Error: enter a valid number';
    messageEl.classList.remove('success');
    messageEl.classList.add('error');
    messageEl.classList.add('shake');
    setTimeout(()=> messageEl.classList.remove('shake'), 420);
    return;
  }
  if (num < rangeStart || num > rangeEnd) {
    messageEl.textContent = `Please enter a number between ${rangeStart} and ${rangeEnd}`;
    return;
  }
  // update guess history and proximity
  const dist = Math.abs(num - randomNumber);
  const maxDist = (rangeEnd - rangeStart) || 1;
  const percent = Math.max(0, Math.min(100, Math.round((1 - (dist / maxDist)) * 100)));
  proximityFill.style.width = percent + '%';
  // Do not display the numeric distance — only show a neutral placeholder or 'Correct'
  proximityText.textContent = dist === 0 ? 'Correct' : '—';
  // history has been removed; we only show proximity meter
  attempts += 1;
  triesEl.textContent = attempts;
  // small feedback on try
  triesEl.classList.add('pulse');
  setTimeout(()=>triesEl.classList.remove('pulse'),220);
  if (num === randomNumber) {
    messageEl.textContent = `Correct! ${num} is the number.`;
    messageEl.classList.remove('error');
    messageEl.classList.add('success');
    endGame(true);
    playWinSound();
    // pulse result area and tries
    triesEl.classList.add('pulse');
    setTimeout(()=>triesEl.classList.remove('pulse'),900);
  } else if (num > randomNumber) {
    // If the guess is within 5 of the target, only say the player is close
    if (dist <= 5) {
      messageEl.textContent = 'You are too close! Choose a lower number';
    } else {
      messageEl.textContent = 'Too high, choose a lower number';
    }
    messageEl.classList.remove('success');
    messageEl.classList.remove('error');
    // pulse red-ish briefly
    messageEl.style.background = 'linear-gradient(90deg,#ffdada,#ffe3e3)';
    setTimeout(()=> messageEl.style.background = '', 540);
  } else {
    // If the guess is within 5 of the target, only say the player is close
    if (dist <= 5) {
      messageEl.textContent = 'You are too close! Choose a higher number';
    } else {
      messageEl.textContent = 'Too low, choose a higher number';
    }
    messageEl.classList.remove('success');
    messageEl.classList.remove('error');
    messageEl.style.background = 'linear-gradient(90deg,#fff3bf,#fff7e6)';
    setTimeout(()=> messageEl.style.background = '', 540);
  }
  guessInput.value = '';
  guessInput.focus();
}

// Micro audio using Web Audio API
function playWinSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(880, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start(now);
    o.frequency.exponentialRampToValueAtTime(660, now + 0.18);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    o.stop(now + 0.4);
  } catch (e) {
    // ignore audio failures (e.g., blocked before user gesture)
  }
}

// Play click sound for submit
function playClickSound(){
  try{const audioCtx=new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator();const g=audioCtx.createGain();o.type='square';o.frequency.setValueAtTime(700,audioCtx.currentTime);g.gain.setValueAtTime(0.02,audioCtx.currentTime);o.connect(g);g.connect(audioCtx.destination);o.start();setTimeout(()=>{o.stop();},80);}catch(e){}
}

// Events
playBtn.addEventListener('click',()=>{
  startGame();
});

difficultyBtn.addEventListener('click',()=>{
  // preselect radios according to rangeEnd
  const label = (rangeEnd === 20) ? 'easy' : (rangeEnd === 50) ? 'medium' : 'hard';
  difficultyRadios.forEach(r=> r.checked = (r.value===label));
  showView('difficultyView');
});

quitBtn.addEventListener('click',()=>{
  if (confirm('Are you sure you want to quit?')) {
    // Simulate the console "Goodbye!"
    alert('Goodbye!');
    showView('menu');
  }
});

playAgainBtn.addEventListener('click',()=>{
  startGame();
});

backToMenuBtn.addEventListener('click',()=>{
  stopTimer();
  showView('menu');
});

submitGuess.addEventListener('click',()=>{ submit(); });

// Click sound on submit
submitGuess.addEventListener('click',()=>{ playClickSound(); });

guessInput.addEventListener('keydown',(e)=>{
  if (e.key === 'Enter') { submit(); }
});

saveDifficulty.addEventListener('click',()=>{
  const selected = document.querySelector('input[name="difficulty"]:checked');
  if (selected) setDifficulty(selected.value);
  showView('menu');
});

cancelDifficulty.addEventListener('click',()=>{
  showView('menu');
});

newGameBtn.addEventListener('click',()=>{ startGame(); });

goMenuBtn.addEventListener('click',()=>{ showView('menu'); });

// Ensure initial range text
updateRangeText();

// Load settings and scoreboard
function loadState(){
  const s = localStorage.getItem('numbergames_settings');
  if (s) settings = JSON.parse(s);
  const b = localStorage.getItem('numbergames_best');
  if (b) bestScores = JSON.parse(b);
  // update UI
  themeToggle.textContent = settings.theme === 'light' ? '🌞' : '🌓';
  if (settings.theme === 'light') document.body.classList.add('light');
  updateScoreboard();
}

function saveState(){
  localStorage.setItem('numbergames_settings', JSON.stringify(settings));
  localStorage.setItem('numbergames_best', JSON.stringify(bestScores));
}

// Scoreboard helpers
function updateScoreboard(){
  const keys = ['easy','medium','hard'];
  scoreboardList.querySelectorAll('.score-item').forEach(li => {
    const diff = li.dataset.diff;
    const s = bestScores[diff];
    const display = s ? `${s.time}s • ${s.tries} tries` : '—';
    li.querySelector('.score-value').textContent = display;
  });
}

resetScoresBtn.addEventListener('click', ()=>{
  if (!confirm('Clear all best scores?')) return;
  bestScores = { easy: null, medium: null, hard: null };
  saveState();
  updateScoreboard();
});

function updateBestScore(){
  const label = (rangeEnd === 20) ? 'easy' : (rangeEnd === 50) ? 'medium' : 'hard';
  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const record = bestScores[label];
  let isNew = false;
  if (!record || elapsed < record.time || (elapsed === record.time && attempts < record.tries)){
    bestScores[label] = {time: elapsed, tries: attempts};
    isNew = true;
    saveState();
  }
  updateScoreboard();
  bestScoreText.textContent = isNew ? `New best for ${capitalize(label)} — ${elapsed}s in ${attempts} tries` : `Best: ${bestScores[label].time}s (${bestScores[label].tries} tries)`;
}

function capitalize(s){ return s[0].toUpperCase()+s.slice(1); }

// Sound and theme toggle
themeToggle.addEventListener('click', ()=>{ settings.theme = (settings.theme==='dark')?'light':'dark'; document.body.classList.toggle('light'); themeToggle.textContent = document.body.classList.contains('light') ? '🌞' : '🌓'; saveState(); });

// load persisted settings
loadState();

// nice keyboard shortcuts: D for difficulty, P to play, M for menu
window.addEventListener('keydown',(e)=>{
  if (e.key.toLowerCase()==='d') { difficultyBtn.click(); }
  else if (e.key.toLowerCase()==='p') { playBtn.click(); }
  else if (e.key.toLowerCase()==='m') { showView('menu'); }
});

// Set initial focus and menu show
showView('menu');
