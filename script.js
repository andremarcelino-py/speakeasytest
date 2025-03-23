const questions = [
  { question: "Como se diz 'eu sou estudante' em inglês?", options: ["I am a student", "I am student", "I student am"], answer: 0, explanation: "O correto é 'I am a student' pois 'a' é necessário antes de 'student'." },
  { question: "Como perguntar se alguém gosta de pizza?", options: ["Do you like pizza?", "Like pizza you?", "Pizza do you like?"], answer: 0, explanation: "'Do you like pizza?' é a forma correta pois segue a estrutura do inglês." },
  { question: "Traduza 'Onde você mora?'", options: ["Where are you living?", "Where do you live?", "Where is you live?"], answer: 1, explanation: "'Where do you live?' é a forma correta para perguntas no presente." }
];

let currentQuestion = 0;
let score = 0;
let mistakes = [];

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next");
const scoreElement = document.getElementById("score");
const quizContainer = document.getElementById("quiz-container");
const endScreen = document.getElementById("end-screen");
const finalMessageElement = document.getElementById("final-message");
const mistakesList = document.getElementById("mistakes-list");
const restartButton = document.getElementById("restart-button");

function loadQuestion() {
  const q = questions[currentQuestion];
  questionElement.textContent = q.question;
  optionsElement.innerHTML = "";
  q.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.textContent = option;
    li.onclick = () => selectAnswer(index);
    optionsElement.appendChild(li);
  });
}

function selectAnswer(selected) {
  const q = questions[currentQuestion];
  if (selected === q.answer) {
    score++;
  } else {
    mistakes.push(`${q.question} - Correto: ${q.options[q.answer]} (${q.explanation})`);
  }
  scoreElement.textContent = score;
  nextButton.disabled = false;
}

nextButton.onclick = () => {
  currentQuestion++;
  nextButton.disabled = true;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    endQuiz();
  }
};

function endQuiz() {
  quizContainer.style.display = "none";
  endScreen.style.display = "block";
  finalMessageElement.textContent = `Você acertou ${score}/${questions.length}.`;
  mistakesList.innerHTML = mistakes.map(m => `<li>${m}</li>`).join("");
}

restartButton.onclick = () => location.reload();

loadQuestion();