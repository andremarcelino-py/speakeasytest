import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";  
import { getFirestore, collection, addDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";  

const firebaseConfig = {  
  apiKey: "AIzaSyBCVGQk1Ctp1IZJrHQdM6YUSItaD3pypjg",  
  authDomain: "testspeakeasy.firebaseapp.com",  
  projectId: "testspeakeasy",  
  storageBucket: "testspeakeasy.appspot.com",  
  messagingSenderId: "732379388945",  
  appId: "1:732379388945:web:a46304dd51b10e2850e5b0",  
  measurementId: "G-WNB4XS2YJB"  
};  

const app = initializeApp(firebaseConfig);  
const db = getFirestore(app);

// Elementos da interface
const registerContainer = document.getElementById("register-container");
const menuContainer = document.getElementById("menu-container");
const quizContainer = document.getElementById("quiz-container");
const perguntasContainer = document.getElementById("perguntas-container");
const perguntasQuizContainer = document.getElementById("perguntas-quiz-container");
const libraryContainer = document.getElementById("library-container");
const rankingContainer = document.getElementById("ranking-container");
const endScreen = document.getElementById("end-screen");
const perguntasEndScreen = document.getElementById("perguntas-end-screen");

const startButton = document.getElementById("start-button");
const btnQuiz = document.getElementById("btnQuiz");
const btnPerguntas = document.getElementById("btnPerguntas");
const btnLibrary = document.getElementById("btnLibrary");
const btnRanking = document.getElementById("btnRanking");
const btnFacil = document.getElementById("btnFacil");
const btnMedio = document.getElementById("btnMedio");
const btnDificil = document.getElementById("btnDificil");

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const finalMessageElement = document.getElementById("final-message");
const errorListElement = document.getElementById("error-list");
const restartButton = document.getElementById("restart-button");
const rankingList = document.getElementById("ranking-list");

const perguntasQuestionElement = document.getElementById("perguntas-question");
const perguntasOptionsElement = document.getElementById("perguntas-options");
const perguntasScoreElement = document.getElementById("perguntas-score");
const perguntasTimerElement = document.getElementById("perguntas-timer");
const perguntasFinalMessageElement = document.getElementById("perguntas-final-message");
const perguntasErrorListElement = document.getElementById("perguntas-error-list");
const perguntasRestartButton = document.getElementById("perguntas-restart-button");
const perguntasMenuButton = document.getElementById("perguntas-menu-button");

// Variáveis para os Quizzes
let allQuestions = [
  { 
    question: "What is 'eu sou estudante' in English?", 
    options: ["I am a student", "I am student", "I student am", "A student I am"], 
    answer: 0,
    difficulty: "easy",
    libraryRef: "frases-basicas"
  },
  { 
    question: "Which one is correct?", 
    options: ["Do you like pizza?", "Like pizza you?", "Pizza do you like?", "You pizza like?"], 
    answer: 0,
    difficulty: "easy",
    libraryRef: "frases-basicas"
  },
  { 
    question: "What does 'I am learning English' mean?", 
    options: ["Eu estou aprendendo inglês", "Eu aprendi inglês", "Eu ensino inglês", "Eu amo inglês"], 
    answer: 0,
    difficulty: "medium",
    libraryRef: "frases-basicas"
  },
  { 
    question: "How do you say 'Onde você mora?' in English?", 
    options: ["Where are you living?", "Where do you live?", "Where is you live?", "Where you live?"], 
    answer: 1,
    difficulty: "medium",
    libraryRef: "frases-basicas"
  },
  { 
    question: "What is the plural of 'child'?", 
    options: ["Childs", "Children", "Childes", "Childern"], 
    answer: 1,
    difficulty: "hard",
    libraryRef: "verbos"
  },
  { 
    question: "What does 'She is my sister' mean?", 
    options: ["Ela é minha irmã", "Ela é minha prima", "Ela é minha mãe", "Ela é minha amiga"], 
    answer: 0,
    difficulty: "easy",
    libraryRef: "frases-basicas"
  },
  { 
    question: "Which sentence is correct?", 
    options: ["He have a car", "He has a car", "He are a car", "He do have car"], 
    answer: 1,
    difficulty: "hard",
    libraryRef: "verbos"
  },
  { 
    question: "How do you say 'Eu gosto de ler livros' in English?", 
    options: ["I like to read books", "I likes to read books", "I am like to read books", "I reading books"], 
    answer: 0,
    difficulty: "medium",
    libraryRef: "verbos"
  },
  { 
    question: "What is 'yesterday' in Portuguese?", 
    options: ["Amanhã", "Ontem", "Hoje", "Depois"], 
    answer: 1,
    difficulty: "easy",
    libraryRef: "frases-basicas"
  },
  { 
    question: "Which one is correct?", 
    options: ["She don't like coffee", "She doesn't like coffee", "She not like coffee", "She no like coffee"], 
    answer: 1,
    difficulty: "hard",
    libraryRef: "verbos"
  },
  { 
    question: "Translate: 'They are my friends'", 
    options: ["Eles são meus amigos", "Eles foram meus amigos", "Eles estavam meus amigos", "Eles é meus amigos"], 
    answer: 0,
    difficulty: "easy",
    libraryRef: "frases-basicas"
  },
  { 
    question: "What does 'goodbye' mean?", 
    options: ["Olá", "Obrigado", "Adeus", "Por favor"], 
    answer: 2,
    difficulty: "easy",
    libraryRef: "frases-basicas"
  },
  { 
    question: "What is the opposite of 'cold'?", 
    options: ["Hot", "Warm", "Cool", "Frozen"], 
    answer: 0,
    difficulty: "medium",
    libraryRef: "frases-basicas"
  },
  { 
    question: "Choose the correct sentence", 
    options: ["She go to school", "She goes to school", "She going to school", "She is go to school"], 
    answer: 1,
    difficulty: "hard",
    libraryRef: "verbos"
  },
  { 
    question: "How do you say 'Nós estamos felizes' in English?", 
    options: ["We is happy", "We are happy", "We am happy", "We do happy"], 
    answer: 1,
    difficulty: "medium",
    libraryRef: "frases-basicas"
  }
];

let questions = [];
let score = 0;
let currentQuestion = 0;
let errors = [];
let quizTimer = 0;
let timerInterval;

let perguntasQuestions = [];
let perguntasScore = 0;
let currentPerguntaQuestion = 0;
let perguntasErrors = [];
let perguntasTimer = 0;
let perguntasTimerInterval;

// Funções do Quiz Principal
function getRandomQuestions() {
  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 15);
}

function startTimer() {
  quizTimer = 0;
  timerElement.textContent = quizTimer;
  timerInterval = setInterval(() => {
    quizTimer++;
    timerElement.textContent = quizTimer;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

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

function checkAnswer(selected) {
  const q = questions[currentQuestion];
  const options = optionsElement.getElementsByTagName("li");
  
  for (let i = 0; i < options.length; i++) {
    options[i].classList.remove("correct", "wrong");
    if (i === q.answer) {
      options[i].classList.add("correct");
    } else if (i === selected) {
      options[i].classList.add("wrong");
    }
    options[i].style.pointerEvents = "none";
  }
  
  if (selected === q.answer) {
    score++;
    updateScore();
  } else {
    errors.push(`Pergunta: ${q.question} - Resposta correta: ${q.options[q.answer]}`);
  }
  
  setTimeout(() => {
    currentQuestion++;
    loadQuestion();
  }, 1500);
}

function updateScore() {
  scoreElement.textContent = score;
}

function endQuiz() {
  stopTimer();
  quizContainer.style.display = "none";
  endScreen.style.display = "block";
  finalMessageElement.textContent = `Pontuação Final: ${score}/15 | Tempo: ${quizTimer}s`;
  errorListElement.innerHTML = errors.map(err => `<li class="error-item">${err}</li>`).join("");
  const userName = document.getElementById("name").value;
  saveScore(userName, score, quizTimer);
}

restartButton.onclick = () => {
  score = 0;
  currentQuestion = 0;
  errors = [];
  questions = getRandomQuestions();
  endScreen.style.display = "none";
  quizContainer.style.display = "block";
  updateScore();
  startTimer();
  loadQuestion();
};

// Funções do Quiz de Perguntas
function startPerguntasTimer() {
  perguntasTimer = 0;
  perguntasTimerElement.textContent = perguntasTimer;
  perguntasTimerInterval = setInterval(() => {
    perguntasTimer++;
    perguntasTimerElement.textContent = perguntasTimer;
  }, 1000);
}

function stopPerguntasTimer() {
  clearInterval(perguntasTimerInterval);
}

function loadPerguntasQuestion() {
  if (currentPerguntaQuestion < perguntasQuestions.length) {
    const q = perguntasQuestions[currentPerguntaQuestion];
    perguntasQuestionElement.textContent = q.question;
    perguntasOptionsElement.innerHTML = "";
    q.options.forEach((option, index) => {
      const li = document.createElement("li");
      li.textContent = option;
      li.onclick = () => checkPerguntasAnswer(index);
      perguntasOptionsElement.appendChild(li);
    });
  } else {
    endPerguntasQuiz();
  }
}

function checkPerguntasAnswer(selected) {
  const q = perguntasQuestions[currentPerguntaQuestion];
  const options = perguntasOptionsElement.getElementsByTagName("li");
  
  for (let i = 0; i < options.length; i++) {
    options[i].classList.remove("correct", "wrong");
    if (i === q.answer) {
      options[i].classList.add("correct");
    } else if (i === selected) {
      options[i].classList.add("wrong");
    }
    options[i].style.pointerEvents = "none";
  }
  
  if (selected === q.answer) {
    perguntasScore++;
    updatePerguntasScore();
  } else {
    perguntasErrors.push({
      question: q.question,
      correct: q.options[q.answer],
      libraryRef: q.libraryRef
    });
  }
  
  setTimeout(() => {
    currentPerguntaQuestion++;
    loadPerguntasQuestion();
  }, 1500);
}

function updatePerguntasScore() {
  perguntasScoreElement.textContent = perguntasScore;
}

function endPerguntasQuiz() {
  stopPerguntasTimer();
  perguntasQuizContainer.style.display = "none";
  perguntasEndScreen.style.display = "block";
  perguntasFinalMessageElement.textContent = `Pontuação Final: ${perguntasScore}/10 | Tempo: ${perguntasTimer}s`;
  
  perguntasErrorListElement.innerHTML = perguntasErrors.map(err => `
    <li class="error-item">
      ${err.question}<br>
      Resposta correta: ${err.correct}
      <button onclick="showLibrary('${err.libraryRef}')">Aprenda Mais</button>
    </li>
  `).join("");
}

perguntasRestartButton.onclick = () => {
  const currentDifficulty = perguntasQuestions[0]?.difficulty || 'easy';
  startPerguntasQuiz(currentDifficulty);
};

perguntasMenuButton.onclick = () => {
  hideAllSections();
  menuContainer.style.display = "block";
};

// Função para exibir a biblioteca
window.showLibrary = (sectionId) => {
  hideAllSections();
  libraryContainer.style.display = "block";
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
};

// Funções compartilhadas
async function saveScore(userName, score, time) {
  const querySnapshot = await getDocs(collection(db, "users"));
  let userDoc;
  querySnapshot.forEach((doc) => {
    if (doc.data().name === userName) {
      userDoc = doc.ref;
    }
  });
  if (userDoc) {
    await updateDoc(userDoc, { score, time });
  }
}

function hideAllSections() {
  registerContainer.style.display = "none";
  menuContainer.style.display = "none";
  quizContainer.style.display = "none";
  perguntasContainer.style.display = "none";
  perguntasQuizContainer.style.display = "none";
  libraryContainer.style.display = "none";
  rankingContainer.style.display = "none";
  endScreen.style.display = "none";
  perguntasEndScreen.style.display = "none";
}

// Inicia o Quiz de Perguntas por nível
function startPerguntasQuiz(difficulty) {
  perguntasQuestions = allQuestions
    .filter(q => q.difficulty === difficulty)
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
  
  perguntasScore = 0;
  currentPerguntaQuestion = 0;
  perguntasErrors = [];
  updatePerguntasScore();
  
  hideAllSections();
  perguntasQuizContainer.style.display = "block";
  startPerguntasTimer();
  loadPerguntasQuestion();
}

// Eventos de menu
btnQuiz.onclick = () => {
  hideAllSections();
  quizContainer.style.display = "block";
  questions = getRandomQuestions();
  score = 0;
  currentQuestion = 0;
  errors = [];
  updateScore();
  startTimer();
  loadQuestion();
};

btnPerguntas.onclick = () => {
  hideAllSections();
  perguntasContainer.style.display = "block";
};

btnLibrary.onclick = () => {
  hideAllSections();
  libraryContainer.style.display = "block";
};

btnRanking.onclick = async () => {
  hideAllSections();
  rankingContainer.style.display = "block";
  rankingList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "users"));
  let users = [];
  querySnapshot.forEach(doc => {
    let userData = doc.data();
    users.push({ name: userData.name, score: userData.score || 0, time: userData.time || 9999 });
  });
  users.sort((a, b) => {
    if(a.score === b.score) {
      return a.time - b.time;
    }
    return b.score - a.score;
  });
  users.forEach((user, index) => {
    const li = document.createElement("li");
    li.className = "animate-in";
    li.style.animationDelay = `${index * 0.1}s`;
    li.innerHTML = `<span>${index + 1}. ${user.name}</span><span>Pontos: ${user.score} | Tempo: ${user.time}s</span>`;
    rankingList.appendChild(li);
  });
};

// Lógica de cadastro
startButton.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const number = document.getElementById("number").value;
  if (name && number) {
    try {
      await addDoc(collection(db, "users"), { name, number });
      registerContainer.style.display = "none";
      menuContainer.style.display = "block";
    } catch (error) {
      console.error("Erro ao salvar no Firestore: ", error);
    }
  } else {
    alert("Preencha todos os campos!");
  }
});