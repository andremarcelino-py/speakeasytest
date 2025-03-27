import { db } from "./firebase-config.js";
import { updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { currentUser } from "./main.js";

// Lista de perguntas
const allQuestions = [
  { question: "What is 'eu sou estudante' in English?", options: ["I am a student", "I am student", "I student am", "A student I am"], answer: 0 },
  { question: "Which one is correct?", options: ["Do you like pizza?", "Like pizza you?", "Pizza do you like?", "You pizza like?"], answer: 0 },
  { question: "What does 'I am learning English' mean?", options: ["Eu estou aprendendo inglês", "Eu aprendi inglês", "Eu ensino inglês", "Eu amo inglês"], answer: 0 },
  { question: "How do you say 'Onde você mora?' in English?", options: ["Where are you living?", "Where do you live?", "Where is you live?", "Where you live?"], answer: 1 },
  { question: "What is the plural of 'child'?", options: ["Childs", "Children", "Childes", "Childern"], answer: 1 }
];

// Função para pegar perguntas aleatórias
function getRandomQuestions() {
  return [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 5);
}

let questions = getRandomQuestions();
let score = 0;
let currentQuestion = 0;
let errors = [];

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const quizContainer = document.getElementById("quiz-container");
const endScreen = document.getElementById("end-screen");
const finalMessageElement = document.getElementById("final-message");
const errorListElement = document.getElementById("error-list");
const restartButton = document.getElementById("restart-button");

function loadQuestion() {
  if (currentQuestion < questions.length) {
    const q = questions[currentQuestion];
    questionElement.textContent = q.question;
    optionsElement.innerHTML = "";

    q.options.forEach((option, index) => {
      const li = document.createElement("li");
      li.textContent = option;
      li.onclick = () => checkAnswer(index);
      optionsElement.appendChild(li);
    });
  } else {
    endQuiz();
  }
}

async function checkAnswer(selected) {
  const q = questions[currentQuestion];

  for (let i = 0; i < optionsElement.children.length; i++) {
    optionsElement.children[i].style.backgroundColor =
      i === q.answer ? "green" : i === selected ? "red" : "#9B59B6";
    optionsElement.children[i].style.pointerEvents = "none";
  }

  if (selected === q.answer) {
    score++;
    updateScore();
  } else {
    errors.push(`Q: ${q.question} - R: ${q.options[q.answer]}`);
  }

  setTimeout(() => {
    currentQuestion++;
    loadQuestion();
  }, 1000);
}

function updateScore() {
  document.getElementById("score").textContent = score;
}

async function endQuiz() {
  quizContainer.style.display = "none";
  endScreen.style.display = "block";
  finalMessageElement.textContent = `Pontuação: ${score}/5`;
  errorListElement.innerHTML = errors.map(err => `<li>${err}</li>`).join("");

  if (currentUser) {
    try {
      await updateDoc(doc(db, "users", currentUser.id), { score });
    } catch (error) {
      console.error("Erro ao atualizar pont