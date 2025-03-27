import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  updateDoc,
  where,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

let currentUser = null;

document.getElementById("start-button").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const number = document.getElementById("number").value.trim();

  if (name && number) {
    try {
      // Verificar se o usuário já existe
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
  { question: "Which one is correct?", options: ["She don’t like coffee", "She doesn’t like coffee", "She not like coffee", "She no like coffee"], answer: 1 },
  { question: "Translate: 'They are my friends'", options: ["Eles são meus amigos", "Eles foram meus amigos", "Eles estavam meus amigos", "Eles é meus amigos"], answer: 0 },
  { question: "What does 'goodbye' mean?", options: ["Olá", "Obrigado", "Adeus", "Por favor"], answer: 2 },
  { question: "What is the opposite of 'cold'?", options: ["Hot", "Warm", "Cool", "Frozen"], answer: 0 },
  { question: "Choose the correct sentence", options: ["She go to school", "She goes to school", "She going to school", "She is go to school"], answer: 1 },
  { question: "How do you say 'Nós estamos felizes' in English?", options: ["We is happy", "We are happy", "We am happy", "We do happy"], answer: 1 },
  { question: "What is the past of 'eat'?", options: ["Ate", "Eaten", "Eating", "Eats"], answer: 0 },
  { question: "What is 'verde' in English?", options: ["Red", "Blue", "Green", "Yellow"], answer: 2 },
  { question: "Which is correct?", options: ["She have a dog", "She has a dog", "She do has a dog", "She has dog"], answer: 1 },
  { question: "How do you say 'Me ajuda, por favor' in English?", options: ["Help me, please", "Please me help", "Me help please", "Please, I need help"], answer: 0 },
  { question: "What does 'tired' mean?", options: ["Feliz", "Cansado", "Bravo", "Triste"], answer: 1 }
];


// Função para embaralhar as perguntas e selecionar 5 aleatórias
function getRandomQuestions() {
  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
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

// Eventos para trocar de aba
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