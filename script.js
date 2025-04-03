import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";  
import { getFirestore, collection, addDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";  

const firebaseConfig = {  
  apiKey: "AIzaSyBCVGQk1IZJrHQdM6YUSItaD3pypjg",  
  authDomain: "testspeakeasy.firebaseapp.com",  
  projectId: "testspeakeasy",  
  storageBucket: "testspeakeasy.appspot.com",  
  messagingSenderId: "732379388945",  
  appId: "1:732379388945:web:a46304dd51b10e2850e5b0",  
  measurementId: "G-WNB4XS2YJB"  
};  

const app = initializeApp(firebaseConfig);  
const db = getFirestore(app);

// Elementos do Quiz Original e Menu
const registerContainer = document.getElementById("register-container");
const menuContainer = document.getElementById("menu-container");
const quizContainer = document.getElementById("quiz-container");
const libraryContainer = document.getElementById("library-container");
const rankingContainer = document.getElementById("ranking-container");
const endScreen = document.getElementById("end-screen");

const startButton = document.getElementById("start-button");
const btnQuiz = document.getElementById("btnQuiz");
const btnPerguntas = document.getElementById("btnPerguntas");
const btnLibrary = document.getElementById("btnLibrary");
const btnRanking = document.getElementById("btnRanking");

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const finalMessageElement = document.getElementById("final-message");
const errorListElement = document.getElementById("error-list");
const restartButton = document.getElementById("restart-button");
const rankingList = document.getElementById("ranking-list");

// Variáveis para o Quiz Original
let allQuestions = [
  { question: "What is 'eu sou estudante' in English?", options: ["I am a student", "I am student", "I student am", "A student I am"], answer: 0 },
  { question: "Which one is correct?", options: ["Do you like pizza?", "Like pizza you?", "Pizza do you like?", "You pizza like?"], answer: 0 },
  { question: "What does 'I am learning English' mean?", options: ["Eu estou aprendendo inglês", "Eu aprendi inglês", "Eu ensino inglês", "Eu amo inglês"], answer: 0 },
  { question: "How do you say 'Onde você mora?' in English?", options: ["Where are you living?", "Where do you live?", "Where is you live?", "Where you live?"], answer: 1 },
  { question: "What is the plural of 'child'?", options: ["Childs", "Children", "Childes", "Childern"], answer: 1 },
  { question: "What does 'She is my sister' mean?", options: ["Ela é minha irmã", "Ela é minha prima", "Ela é minha mãe", "Ela é minha amiga"], answer: 0 },
  { question: "Which sentence is correct?", options: ["He have a car", "He has a car", "He are a car", "He do have car"], answer: 1 },
  { question: "How do you say 'Eu gosto de ler livros' in English?", options: ["I like to read books", "I likes to read books", "I am like to read books", "I reading books"], answer: 0 },
  { question: "What is 'yesterday' in Portuguese?", options: ["Amanhã", "Ontem", "Hoje", "Depois"], answer: 1 },
  { question: "Which one is correct?", options: ["She don't like coffee", "She doesn't like coffee", "She not like coffee", "She no like coffee"], answer: 1 },
  { question: "Translate: 'They are my friends'", options: ["Eles são meus amigos", "Eles foram meus amigos", "Eles estavam meus amigos", "Eles é meus amigos"], answer: 0 },
  { question: "What does 'goodbye' mean?", options: ["Olá", "Obrigado", "Adeus", "Por favor"], answer: 2 },
  { question: "What is the opposite of 'cold'?", options: ["Hot", "Warm", "Cool", "Frozen"], answer: 0 },
  { question: "Choose the correct sentence", options: ["She go to school", "She goes to school", "She going to school", "She is go to school"], answer: 1 },
  { question: "How do you say 'Nós estamos felizes' in English?", options: ["We is happy", "We are happy", "We am happy", "We do happy"], answer: 1 }
];
let questions = [];
let score = 0;
let currentQuestion = 0;
let errors = [];
let quizTimer = 0;
let timerInterval;

// Funções do Quiz Original
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
    errors.push({ question: q.question, correct: q.options[q.answer] });
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
  errorListElement.innerHTML = errors.map(err => `<li class="error-item">Pergunta: ${err.question} - Resposta correta: ${err.correct}</li>`).join("");
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

// Eventos de Menu
function hideAllSections() {
  quizContainer.style.display = "none";
  perguntasContainer.style.display = "none";
  libraryContainer.style.display = "none";
  rankingContainer.style.display = "none";
  endScreen.style.display = "none";
  menuContainer.style.display = "none";
  // Também escondemos a área de perguntas-quiz (aba Perguntas)
  perguntasQuizContainer.style.display = "none";
}
  
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

/* ====== LÓGICA DO QUIZ DA ABA "PERGUNTAS" ====== */

// Elementos específicos do quiz "Perguntas"
const perguntasQuizContainer = document.getElementById("perguntas-quiz-container");
const perguntasQuestionEl = document.getElementById("perguntas-question");
const perguntasOptionsEl = document.getElementById("perguntas-options");
const perguntasScoreEl = document.getElementById("perguntas-score");
const perguntasEndEl = document.getElementById("perguntas-end");
const perguntasFinalMessageEl = document.getElementById("perguntas-final-message");
const perguntasErrorListEl = document.getElementById("perguntas-error-list");

const btnEasy = document.getElementById("btnEasy");
const btnMedium = document.getElementById("btnMedium");
const btnHard = document.getElementById("btnHard");
const btnLearnMore = document.getElementById("btnLearnMore");
const btnMenuFromPerguntas = document.getElementById("btnMenuFromPerguntas");

// Arrays de perguntas para cada nível (cada questão inclui uma explicação vinculada à biblioteca)
const easyQuestions = [
  { question: "Fácil: What is 'bom dia' in English?", options: ["Good morning", "Good day", "Morning"], answer: 0, explanation: "Na biblioteca, 'Good morning' é o cumprimento padrão para 'bom dia'." },
  { question: "Fácil: How do you say 'obrigado'?", options: ["Thank you", "Thanks", "I thank you"], answer: 0, explanation: "A expressão correta é 'Thank you'." },
  { question: "Fácil: Translate 'Eu gosto de café'", options: ["I like coffee", "I love coffee", "I drink coffee"], answer: 0, explanation: "A tradução de 'Eu gosto de café' é 'I like coffee'." },
  { question: "Fácil: How do you say 'até logo'?", options: ["See you later", "Goodbye", "See you soon"], answer: 0, explanation: "A expressão 'See you later' é usada para 'até logo'." },
  { question: "Fácil: What is 'sim' in English?", options: ["Yes", "No", "Maybe"], answer: 0, explanation: "A tradução de 'sim' é 'Yes'." },
  { question: "Fácil: Translate 'por favor'", options: ["Please", "Thanks", "Excuse me"], answer: 0, explanation: "A palavra 'por favor' em inglês é 'Please'." },
  { question: "Fácil: What is 'casa' in English?", options: ["House", "Home", "Household"], answer: 0, explanation: "A tradução correta de 'casa' é 'House'." },
  { question: "Fácil: How do you say 'amigo'?", options: ["Friend", "Buddy", "Pal"], answer: 0, explanation: "A palavra 'amigo' se traduz como 'Friend'." },
  { question: "Fácil: What is 'livro'?", options: ["Book", "Library", "Novel"], answer: 0, explanation: "A tradução de 'livro' é 'Book'." },
  { question: "Fácil: Translate 'água'", options: ["Water", "Juice", "Milk"], answer: 0, explanation: "A palavra 'água' em inglês é 'Water'." }
];

const mediumQuestions = [
  { question: "Médio: Translate 'Eu estou aprendendo inglês'", options: ["I am learning English", "I learn English", "I have learned English"], answer: 0, explanation: "A frase correta é 'I am learning English'." },
  { question: "Médio: How do you say 'Onde fica a estação?'", options: ["Where is the station?", "Where station is?", "Station where?"], answer: 0, explanation: "'Where is the station?' é a forma correta." },
  { question: "Médio: Translate 'Ela gosta de música'", options: ["She likes music", "She love music", "She is liking music"], answer: 0, explanation: "A tradução adequada é 'She likes music'." },
  { question: "Médio: What is the plural of 'mouse'?", options: ["Mouses", "Mice", "Mouse"], answer: 1, explanation: "O plural de 'mouse' é 'Mice'." },
  { question: "Médio: How do you say 'preciso de ajuda'?", options: ["I need help", "I need a help", "I needing help"], answer: 0, explanation: "A forma correta é 'I need help'." },
  { question: "Médio: Translate 'Vamos almoçar'", options: ["Let's have lunch", "Let's lunch", "We lunch"], answer: 0, explanation: "A tradução é 'Let's have lunch'." },
  { question: "Médio: What is 'rápido' in English?", options: ["Fast", "Quick", "Speedy"], answer: 0, explanation: "'Fast' é a palavra adequada para 'rápido'." },
  { question: "Médio: Translate 'Ela mora em Nova York'", options: ["She lives in New York", "She live in New York", "She living in New York"], answer: 0, explanation: "A forma correta é 'She lives in New York'." },
  { question: "Médio: How do you say 'Estou cansado'?", options: ["I am tired", "I tired", "I am tire"], answer: 0, explanation: "'I am tired' é a tradução correta." },
  { question: "Médio: Translate 'Ele trabalha muito'", options: ["He works a lot", "He work a lot", "He is working a lot"], answer: 0, explanation: "A tradução correta é 'He works a lot'." }
];

const hardQuestions = [
  { question: "Difícil: Translate 'A complexidade da linguagem é fascinante'", options: ["The complexity of language is fascinating", "The language complexity is fascinating", "Language complexity fascinates"], answer: 0, explanation: "A tradução adequada é 'The complexity of language is fascinating'." },
  { question: "Difícil: How do you say 'desenvolvimento sustentável'?", options: ["Sustainable development", "Development sustainable", "Sustainability development"], answer: 0, explanation: "A forma correta é 'Sustainable development'." },
  { question: "Difícil: Translate 'O conhecimento é poder'", options: ["Knowledge is power", "Knowledge are power", "The knowledge is power"], answer: 0, explanation: "'Knowledge is power' é a tradução clássica." },
  { question: "Difícil: How do you say 'perspectiva global'?", options: ["Global perspective", "Perspective global", "World perspective"], answer: 0, explanation: "A expressão correta é 'Global perspective'." },
  { question: "Difícil: Translate 'As nuances da comunicação são sutis'", options: ["The nuances of communication are subtle", "Communication nuances are subtle", "Nuances in communication subtle"], answer: 0, explanation: "A tradução é 'The nuances of communication are subtle'." },
  { question: "Difícil: How do you say 'interdisciplinaridade'?", options: ["Interdisciplinarity", "Interdisciplinary", "Interdiscipline"], answer: 0, explanation: "'Interdisciplinarity' é o termo correto." },
  { question: "Difícil: Translate 'O impacto cultural é profundo'", options: ["The cultural impact is profound", "Cultural impact is deep", "The impact of culture is profound"], answer: 0, explanation: "A forma correta é 'The cultural impact is profound'." },
  { question: "Difícil: How do you say 'desafios contemporâneos'?", options: ["Contemporary challenges", "Challenges contemporary", "Modern challenges"], answer: 0, explanation: "A tradução adequada é 'Contemporary challenges'." },
  { question: "Difícil: Translate 'A inovação impulsiona o progresso'", options: ["Innovation drives progress", "Innovation is driving progress", "Progress is driven by innovation"], answer: 0, explanation: "A forma correta é 'Innovation drives progress'." },
  { question: "Difícil: How do you say 'análise crítica'?", options: ["Critical analysis", "Critic analysis", "Critical analyse"], answer: 0, explanation: "A tradução correta é 'Critical analysis'." }
];

let perguntasQuestions = [];
let perguntasScore = 0;
let perguntasCurrentQuestion = 0;
let perguntasErrors = [];

// Funções do Quiz de Perguntas
function getPerguntasQuestions(questionsArray) {
  const shuffled = questionsArray.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
}

function loadPerguntasQuestion() {
  if (perguntasCurrentQuestion < perguntasQuestions.length) {
    const q = perguntasQuestions[perguntasCurrentQuestion];
    perguntasQuestionEl.textContent = q.question;
    perguntasOptionsEl.innerHTML = "";
    q.options.forEach((option, index) => {
      const li = document.createElement("li");
      li.textContent = option;
      li.onclick = () => checkPerguntasAnswer(index);
      perguntasOptionsEl.appendChild(li);
    });
  } else {
    endPerguntasQuiz();
  }
}

function checkPerguntasAnswer(selected) {
  const q = perguntasQuestions[perguntasCurrentQuestion];
  const options = perguntasOptionsEl.getElementsByTagName("li");
  
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
    perguntasScoreEl.textContent = perguntasScore;
  } else {
    perguntasErrors.push({ question: q.question, correct: q.options[q.answer], explanation: q.explanation });
  }
  
  setTimeout(() => {
    perguntasCurrentQuestion++;
    loadPerguntasQuestion();
  }, 1500);
}

function endPerguntasQuiz() {
  perguntasQuizContainer.style.display = "none";
  perguntasEndEl.style.display = "block";
  perguntasFinalMessageEl.textContent = `Pontuação Final: ${perguntasScore}/10`;
  perguntasErrorListEl.innerHTML = perguntasErrors.map(err => `<li class="error-item">Pergunta: ${err.question} - Resposta correta: ${err.correct}</li>`).join("");
}

btnLearnMore.addEventListener("click", () => {
  // Acrescenta as explicações abaixo de cada erro
  let explanationsHtml = "";
  perguntasErrors.forEach(err => {
    explanationsHtml += `<li class="error-item">Explicação: ${err.explanation}</li>`;
  });
  perguntasErrorListEl.innerHTML += explanationsHtml;
});

btnMenuFromPerguntas.addEventListener("click", () => {
  hideAllSections();
  menuContainer.style.display = "block";
});

// Eventos de seleção de nível
btnEasy.addEventListener("click", () => {
  perguntasQuestions = getPerguntasQuestions(easyQuestions);
  perguntasScore = 0;
  perguntasCurrentQuestion = 0;
  perguntasErrors = [];
  document.getElementById("perguntas-difficulty").style.display = "none";
  perguntasQuizContainer.style.display = "block";
  loadPerguntasQuestion();
});

btnMedium.addEventListener("click", () => {
  perguntasQuestions = getPerguntasQuestions(mediumQuestions);
  perguntasScore = 0;
  perguntasCurrentQuestion = 0;
  perguntasErrors = [];
  document.getElementById("perguntas-difficulty").style.display = "none";
  perguntasQuizContainer.style.display = "block";
  loadPerguntasQuestion();
});

btnHard.addEventListener("click", () => {
  perguntasQuestions = getPerguntasQuestions(hardQuestions);
  perguntasScore = 0;
  perguntasCurrentQuestion = 0;
  perguntasErrors = [];
  document.getElementById("perguntas-difficulty").style.display = "none";
  perguntasQuizContainer.style.display = "block";
  loadPerguntasQuestion();
});

// Ao clicar na aba Perguntas, exibe a área de seleção de nível
btnPerguntas.addEventListener("click", () => {
  hideAllSections();
  perguntasContainer.style.display = "block";
  // Certifica que a área de dificuldade fique visível e o quiz oculto
  document.getElementById("perguntas-difficulty").style.display = "block";
  perguntasQuizContainer.style.display = "none";
  perguntasEndEl.style.display = "none";
});