const questions = [
  { question: "How do you say 'gato' in English?", options: ["Dog", "Cat", "Mouse", "Bird"], answer: 1, explanation: "Gato em inglês é 'Cat'." },
  { question: "What is the capital of the USA?", options: ["New York", "Washington D.C.", "Los Angeles", "Chicago"], answer: 1, explanation: "A capital dos EUA é Washington D.C." },
  { question: "Which word is a verb?", options: ["Quickly", "Table", "Run", "Beautiful"], answer: 2, explanation: "'Run' é um verbo que significa 'correr'." },
  { question: "What color is the sun?", options: ["Blue", "Yellow", "Green", "Red"], answer: 1, explanation: "O sol é amarelo." },
  { question: "Translate: 'Eu gosto de estudar'", options: ["I like to study", "I like study", "Study I like", "I studying like"], answer: 0, explanation: "A forma correta é 'I like to study'." },
];

let selectedQuestions = [];
let currentQuestion = 0;
let score = 0;
let errors = [];

function selectRandomQuestions() {
  selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 5);
}

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next");
const scoreElement = document.getElementById("score");
const quizContainer = document.getElementById("quiz-container");
const endScreen = document.getElementById("end-screen");
const finalMessageElement = document.getElementById("final-message");
const errorListElement = document.getElementById("error-list");
const restartButton = document.getElementById("restart-button");

const quizTab = document.getElementById("quizTab");
const libraryTab = document.getElementById("libraryTab");
const libraryContainer = document.getElementById("library-container");

nextButton.disabled = true;

function loadQuestion() {
  nextButton.disabled = true;
  const currentQ = selectedQuestions[currentQuestion];
  questionElement.textContent = currentQ.question;
  optionsElement.innerHTML = "";
  currentQ.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.textContent = option;
    li.onclick = () => checkAnswer(index);
    optionsElement.appendChild(li);
  });
}

function checkAnswer(selected) {
  const currentQ = selectedQuestions[currentQuestion];
  if (selected === currentQ.answer) {
    score++;
  } else {
    errors.push(`${currentQ.question} - Resposta correta: ${currentQ.options[currentQ.answer]} (${currentQ.explanation})`);
  }
  scoreElement.textContent = score;
  nextButton.disabled = false;
}

nextButton.onclick = () => {
  currentQuestion++;
  if (currentQuestion < selectedQuestions.length) {
    loadQuestion();
  } else {
    endQuiz();
  }
};

function endQuiz() {
  quizContainer.style.display = "none";
  endScreen.style.display = "block";
  finalMessageElement.textContent = `Pontuação: ${score}/5`;
  errorListElement.innerHTML = errors.map(err => `<li>${err}</li>`).join("");
}

restartButton.onclick = () => {
  score = 0;
  currentQuestion = 0;
  errors = [];
  endScreen.style.display = "none";
  quizContainer.style.display = "block";
  selectRandomQuestions();
  loadQuestion();
};

selectRandomQuestions();
loadQuestion();

function endQuiz() {
  quizContainer.style.display = "none";
  endScreen.style.display = "block";
  finalMessageElement.textContent = `Pontuação: ${score}/5`;

  errorListElement.innerHTML = errors
    .map(err => `<li class="error-item">${err}</li>`)
    .join("");
}