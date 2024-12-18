const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors()); // Menambahkan CORS untuk mengizinkan akses dari domain lain
app.use(express.json()); // Untuk parsing JSON body

let notesDatabase = {}; // Tempat menyimpan catatan

// Endpoint untuk menyimpan catatan
app.post("/save-notes", (req, res) => {
    const { userId, content } = req.body;

    if (!userId || !content) {
        return res
            .status(400)
            .json({ message: "User ID atau konten catatan tidak lengkap." });
    }

    // Simpan catatan ke dalam 'database' dummy
    notesDatabase[userId] = content;

    res.status(200).json({ message: "Catatan berhasil disimpan!" });
});

// Endpoint untuk mengambil catatan
app.get("/get-notes/:userId", (req, res) => {
    const userId = req.params.userId;
    const content = notesDatabase[userId] || "";

    res.json({ content });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
