const API_URL =
    "https://309335ba-0e3b-4a11-a24a-7b357d4df76a-00-1s9bj865fu066.pike.repl.co"; // Ganti dengan URL server Anda

const users = {
    berryme: "123456",
    lalsky: "cantiku",
};

const profiles = {
    berryme: {
        "Nama Lengkap": "Rahmat Akbar Jefani",
        Panggilan: "Akbar",
        Hobby: "Memancing",
        Foto: "potoprofil.png",
    },
    lalsky: {
        "Nama Lengkap": "Lala Fauziyah",
        Panggilan: "Lala",
        Hobby: "Travelling",
        Foto: "https://pbs.twimg.com/media/GegTxNLaEAIde4E?format=jpg&name=large",
    },
};

let loggedInUser = "";

// Login handler
document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();
        const userId = document.getElementById("user_id").value;
        const password = document.getElementById("password").value;

        if (!userId || !password) {
            alert("User ID dan password harus diisi.");
            return;
        }

        if (users[userId] && users[userId] === password) {
            loggedInUser = userId;
            document.getElementById("displayUserId").textContent = userId;
            showContainer("welcomeContainer");
        } else {
            alert("User ID atau password salah. Coba lagi.");
        }
    });

// Save notes to server
document
    .getElementById("saveNotesBtn")
    .addEventListener("click", async function () {
        const notesContent = document.getElementById("notesInput").value;

        if (!notesContent) {
            alert("Tidak ada catatan untuk disimpan!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/save-notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: loggedInUser,
                    content: notesContent,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            alert(result.message || "Catatan berhasil disimpan!");
        } catch (error) {
            console.error("Gagal menyimpan catatan:", error.message);
            alert("Terjadi kesalahan saat menyimpan catatan.");
        }
    });

// Fetch notes from server
document
    .getElementById("goToNotesBtn")
    .addEventListener("click", async function () {
        showContainer("notesContainer");

        try {
            const response = await fetch(
                `${API_URL}/get-notes/${loggedInUser}`,
            );
            const result = await response.json();
            document.getElementById("notesInput").value = result.content || "";
        } catch (error) {
            console.error("Gagal mengambil catatan:", error.message);
            alert("Terjadi kesalahan saat mengambil catatan.");
        }
    });

// Profile handler
document
    .getElementById("goToProfileBtn")
    .addEventListener("click", function () {
        const userProfile = profiles[loggedInUser];

        if (userProfile) {
            document.getElementById("profileName").textContent =
                userProfile["Nama Lengkap"];
            document.getElementById("profilePanggilan").textContent =
                userProfile["Panggilan"];
            document.getElementById("profileHobby").textContent =
                userProfile["Hobby"];
            document.getElementById("profilePhoto").src = userProfile["Foto"];
            showContainer("profileContainer");
        } else {
            alert("Profil tidak ditemukan.");
        }
    });

// Download notes
document
    .getElementById("downloadNotesBtn")
    .addEventListener("click", function () {
        const notesContent = document.getElementById("notesInput").value;

        if (!notesContent) {
            alert("Tidak ada catatan untuk diunduh!");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(notesContent, 10, 20, { maxWidth: 180 });
        doc.save("notes.pdf");
        alert("Catatan berhasil diunduh dalam format PDF!");
    });

// Logout handler
function logout() {
    loggedInUser = "";
    showContainer("loginContainer");
}

document.getElementById("logoutBtn").addEventListener("click", logout);
document
    .getElementById("logoutBtnFromProfile")
    .addEventListener("click", logout);

// Back navigation
document
    .getElementById("backToProfileBtn")
    .addEventListener("click", function () {
        showContainer("profileContainer");
    });

document
    .getElementById("backToWelcomeBtn")
    .addEventListener("click", function () {
        showContainer("welcomeContainer");
    });

// Helper function to show containers
function showContainer(containerId) {
    document.querySelectorAll(".container").forEach((container) => {
        container.classList.remove("visible");
    });
    document.getElementById(containerId).classList.add("visible");
}
