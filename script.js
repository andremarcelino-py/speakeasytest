// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, query, orderBy, limit, 
  updateDoc, where, getDoc, doc 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBCVGQk1Ctp1IZJrHQdM6YUSItaD3pypjg",
  authDomain: "testspeakeasy.firebaseapp.com",
  projectId: "testspeakeasy",
  storageBucket: "testspeakeasy.appspot.com",  // Corrigido
  messagingSenderId: "732379388945",
  appId: "1:732379388945:web:a46304dd51b10e2850e5b0",
  measurementId: "G-WNB4XS2YJB"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

let currentUser = null;

// Evento do botão de início
document.getElementById("start-button").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const number = document.getElementById("number").value.trim();

  if (name && number) {
    try {
      const userQuery = query(collection(db, "users"), where("number", "==", number));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        currentUser = userSnapshot.docs[0]; // Usuário já existe
      } else {
        const docRef = await addDoc(collection(db, "users"), { name, number, score: 0 });
        currentUser = await getDoc(docRef); // Novo usuário criado
      }

      document.getElementById("register-container").style.display = "none";
      document.getElementById("main-container").style.display = "block";
    } catch (error) {
      console.error("Erro ao salvar no Firestore: ", error);
    }
  } else {
    alert("Preencha todos os campos!");
  }
});

// Lista de perguntas
const allQuestions = [
  { question: "What is 'eu sou estudante' in English?", options: ["I am a student", "I am student", "I student am", "A student I am"], answer: 0 },
  { question: "Which one is correct?", options: ["Do you like pizza?", "Like pizza you?", "Pizza do you like?", "You pizza like?"], answer: 0 },
  { question: "What does 'I am learning English' mean?", options: ["Eu estou aprendendo inglês", "Eu aprendi inglês", "Eu ensino inglês", "Eu amo inglês"], answer: 0 },
  { question: "How do you say 'Onde você mora?' in English?", options: ["Where are you living?", "Where do you live?", "Where is you live?", "Where you live?"], answer: 1 },
  { question: "What is the plural of 'child'?", options: ["Childs", "Children", "Childes", "Childern"], answer: 1 },
  { question: "What does 'She is my sister' mean?", options: ["Ela é minha irmã", "Ela é minha prima", "Ela é minha mãe", "Ela é minha amiga"], answer: 0 },
  { question: "Which sentence is correct?", options: ["He have a car", "He has a car", "He are a car", "He do have car"], answer: 1 },
  { question: "How do you say 'Eu gosto de ler livros' in English?", options: ["I like to read books", "I likes to read books", "I am like to read books", "I reading books"], answer: 0 },
  { question: "What is 'yesterday' in Portuguese?", options: ["Amanhã", "Ontem", "Hoje", "Depois"], answer: 1 },
  { question: "What does 'goodbye' mean?", options: ["Olá", "Obrigado", "Adeus", "Por favor"], answer: 2 }
];

// Função para embaralhar e selecionar 10 perguntas aleatórias
function getRandomQuestions() {
  return [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
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
  finalMessageElement.textContent = `Pontuação: ${score}/10`;
  errorListElement.innerHTML = errors.map(err => `<li>${err}</li>`).join("");

  if (currentUser) {
    try {
      await updateDoc(doc(db, "users", currentUser.id), { score });
    } catch (error) {
      console.error("Erro ao atualizar pontuação:", error);
    }
  }
}

async function loadRanking() {
  const rankingList = document.getElementById("ranking-list");
  rankingList.innerHTML = "Carregando...";

  try {
    const q = query(collection(db, "users"), orderBy("score", "desc"), limit(5));
    const querySnapshot = await getDocs(q);

    rankingList.innerHTML = "";
    if (querySnapshot.empty) {
      rankingList.innerHTML = "<p>Nenhum jogador registrado ainda.</p>";
    } else {
      querySnapshot.forEach(doc => {
        const user = doc.data();
        const listItem = document.createElement("li");
        listItem.textContent = `${user.name} - ${user.score} pontos`;
        rankingList.appendChild(listItem);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar o ranking:", error);
    rankingList.innerHTML = "Erro ao carregar ranking.";
  }
}

document.getElementById("rankingTab").onclick = () => {
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("ranking-container").style.display = "block";
  loadRanking();
};

restartButton.onclick = () => {
  score = 0;
  currentQuestion = 0;
  errors = [];
  questions = getRandomQuestions();
  quizContainer.style.display = "block";
  endScreen.style.display = "none";
  loadQuestion();
};

loadQuestion();