import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBCVGQk1Ctp1IZJrHQdM6YUSItaD3pypjg",
  authDomain: "testspeakeasy.firebaseapp.com",
  projectId: "testspeakeasy",
  storageBucket: "testspeakeasy.firebasestorage.app",
  messagingSenderId: "732379388945",
  appId: "1:732379388945:web:a46304dd51b10e2850e5b0",
  measurementId: "G-WNB4XS2YJB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("start-button").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const number = document.getElementById("number").value;

  if (name && number) {
    try {
      await addDoc(collection(db, "users"), { name, number });
      document.getElementById("register-container").style.display = "none";
      document.getElementById("main-container").style.display = "block";
    } catch (error) {
      console.error("Erro ao salvar no Firestore: ", error);
    }
  } else {
    alert("Preencha todos os campos!");
  }
});

// Alternar entre abas
document.getElementById("quizTab").onclick = () => {
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("library-container").style.display = "none";
  document.getElementById("ranking-container").style.display = "none";
};

document.getElementById("libraryTab").onclick = () => {
  document.getElementById("library-container").style.display = "block";
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("ranking-container").style.display = "none";
};

document.getElementById("rankingTab").onclick = async () => {
  document.getElementById("ranking-container").style.display = "block";
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("library-container").style.display = "none";
  
  const rankingList = document.getElementById("ranking-list");
  rankingList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "users"));
  const users = [];

  querySnapshot.forEach(doc => users.push(doc.data()));

  users.sort((a, b) => b.score - a.score);

  users.forEach((user, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${user.name} - Pontos: ${user.score || 0}`;
    rankingList.appendChild(li);
  });
};