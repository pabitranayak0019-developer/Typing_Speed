const textDisplay = document.getElementById("textDisplay");
const input = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const mistakesEl = document.getElementById("mistakes");
const startBtn = document.getElementById("start");
const themeToggle = document.getElementById("themeToggle");
const timeButtons = document.querySelectorAll(".time-btn");
const caret = document.getElementById("caret");

const texts = [
  "Typing fast is a skill that improves with regular practice",
  "Good developers focus on accuracy before speed",
  "JavaScript helps create interactive web applications",
  "Application developer function variable accuracy performance project language interface program",
  "Typing speed measures how fast someone types words correctly",
  "A higher typing speed saves time and reduces effort",
  "Regular practice can improve typing speed and accuracy",
];

let totalTime = 15;
let timeLeft = totalTime;
let timer;
let correct = 0;
let mistakes = 0;

timeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    timeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    totalTime = Number(btn.dataset.time);
    timeEl.innerText = totalTime;
  });
});

function loadText() {
  textDisplay.innerHTML = "";
  textDisplay.appendChild(caret);

  const text = texts[Math.floor(Math.random() * texts.length)];
  text.split("").forEach(char => {
    const span = document.createElement("span");
    span.innerText = char;
    textDisplay.appendChild(span);
  });

  moveCaret(0);
}

function moveCaret(index) {
  const chars = textDisplay.querySelectorAll("span");
  if (!chars.length) return;

  if (index < chars.length) {
    caret.style.top = chars[index].offsetTop + "px";
    caret.style.left = chars[index].offsetLeft + "px";
  } else {
    const last = chars[chars.length - 1];
    caret.style.top = last.offsetTop + "px";
    caret.style.left = last.offsetLeft + last.offsetWidth + "px";
  }
}

function startTest() {
  clearInterval(timer);

  timeLeft = totalTime;
  correct = 0;
  mistakes = 0;

  input.value = "";
  input.disabled = false;
  input.focus();

  timeEl.innerText = timeLeft;
  wpmEl.innerText = 0;
  accuracyEl.innerText = 0;
  mistakesEl.innerText = 0;

  loadText();

  timer = setInterval(() => {
    timeLeft--;
    timeEl.innerText = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);
      input.disabled = true;
      calculateResult();
      saveHistory();
    }
  }, 1000);
}

input.addEventListener("input", () => {
  const chars = textDisplay.querySelectorAll("span");
  const typed = input.value.split("");

  correct = 0;
  mistakes = 0;

  chars.forEach((char, index) => {
    if (!typed[index]) {
      char.classList.remove("correct", "incorrect");
    } else if (typed[index] === char.innerText) {
      char.classList.add("correct");
      char.classList.remove("incorrect");
      correct++;
    } else {
      char.classList.add("incorrect");
      char.classList.remove("correct");
      mistakes++;
    }
  });

  mistakesEl.innerText = mistakes;
  moveCaret(typed.length);
});

function calculateResult() {
  const words = input.value.trim().split(/\s+/).length;
  const wpm = Math.round((words * 60) / totalTime);
  const accuracy = Math.round((correct / input.value.length) * 100) || 0;

  wpmEl.innerText = wpm;
  accuracyEl.innerText = accuracy;
}

function saveHistory() {
  const history = JSON.parse(localStorage.getItem("typingHistory")) || [];

  history.push({
    date: new Date().toLocaleString(),
    time: totalTime,
    wpm: wpmEl.innerText,
    accuracy: accuracyEl.innerText,
    mistakes: mistakes
  });

  localStorage.setItem("typingHistory", JSON.stringify(history));
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

startBtn.addEventListener("click", startTest);