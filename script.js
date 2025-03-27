import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, orderBy, limit, updateDoc, where, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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
        currentUser = userSnapshot.docs[0]; // Usuário existente
      } else {
        const docRef = await addDoc(collection(db, "users"), { name, number, score: 0 });
        currentUser = await getDoc(docRef); // Novo usuário
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
];

function getRandomQuestions() {
  return allQuestions.sort(() => Math.random() - 0.5).slice(0, 5);
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
  const options = optionsElement.getElementsByTagName("li");

  for (let i = 0; i < options.length; i++) {
    options[i].style.backgroundColor = i === q.answer ? "green" : (i === selected ? "red" : "#9B59B6");
    options[i].style.pointerEvents = "none";
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

  errorListElement.innerHTML = errors.map(err => `<li class="error-item">${err}</li>`).join("");

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
  rankingList.innerHTML = "<p>Carregando...</p>";

  try {
    const q = query(collection(db, "users"), orderBy("score", "desc"), limit(5));
    const querySnapshot = await getDocs(q);

    rankingList.innerHTML = "";

    if (querySnapshot.empty) {
      rankingList.innerHTML = "<p>Nenhum jogador registrado ainda.</p>";
    } else {
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        const listItem = document.createElement("li");
        listItem.textContent = `${user.name} - ${user.score} pontos`;
        rankingList.appendChild(listItem);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar o ranking:", error);
    rankingList.innerHTML = "<p>Erro ao carregar ranking.</p>";
  }
}

document.getElementById("rankingTab").onclick = () => {
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("library-container").style.display = "none";
  document.getElementById("end-screen").style.display = "none";
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

document.getElementById("quizTab").onclick = () => {
  quizContainer.style.display = "block";
  document.getElementById("library-container").style.display = "none";
  endScreen.style.display = "none";
  questions = getRandomQuestions();
  loadQuestion();
};

document.getElementById("libraryTab").onclick = () => {
  document.getElementById("library-container").style.display = "block";
  quizContainer.style.display = "none";
  endScreen.style.display = "none";
};

loadQuestion();