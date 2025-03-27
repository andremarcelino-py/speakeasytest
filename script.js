import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where, getDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-button").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const number = document.getElementById("number").value.trim();

    if (name && number) {
      try {
        const userQuery = query(collection(db, "users"), where("number", "==", number));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          currentUser = userSnapshot.docs[0];
        } else {
          const docRef = await addDoc(collection(db, "users"), { name, number, score: 0 });
          currentUser = await getDoc(docRef);
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
});

export { currentUser };