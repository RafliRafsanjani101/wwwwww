// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware agar backend bisa membaca data dari form HTML & JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Mengizinkan Express mengakses file statis (HTML, CSS, JS frontend kelompokmu)
app.use(express.static(__dirname));

// Fungsi pembantu untuk membaca data dari database.json
const readDB = () => {
    const data = fs.readFileSync(path.join(__dirname, 'database.json'));
    return JSON.parse(data);
};

// Fungsi pembantu untuk menulis data ke database.json
const writeDB = (data) => {
    fs.writeFileSync(path.join(__dirname, 'database.json'), JSON.stringify(data, null, 2));
};

// --- 1. API PROSES LOGIN ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    
    // Cari user yang cocok
    const user = db.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Kirim respon sukses beserta role-nya
        res.json({ success: true, role: user.role });
    } else {
        res.json({ success: false, message: "Username atau password salah." });
    }
});

// --- 2. API GET SEMUA BUKU (READ) ---
app.get('/api/buku', (req, res) => {
    const db = readDB();
    res.json(db.buku);
});

// --- 3. API TAMBAH BUKU (CREATE) ---
app.post('/api/buku', (req, res) => {
    const { bookCode, bookTitle, bookAuthor, bookCategory, bookStock, bookLocation, bookStatus, bookSynopsis } = req.body;
    const db = readDB();
    
    const newBook = {
        id_buku: Date.now(), // ID unik menggunakan timestamp
        kode_buku: bookCode,
        judul: bookTitle,
        penulis: bookAuthor,
        kategori: bookCategory,
        stok: parseInt(bookStock),
        lokasi_rak: bookLocation,
        status: bookStatus.toLowerCase(),
        sinopsis: bookSynopsis
    };
    
    db.buku.push(newBook);
    writeDB(db);
    res.json({ success: true, message: "Buku berhasil ditambahkan!" });
});

// --- 4. API HAPUS BUKU (DELETE) ---
app.delete('/api/buku/:id', (req, res) => {
    const idBuku = parseInt(req.params.id);
    const db = readDB();
    
    db.buku = db.buku.filter(b => b.id_buku !== idBuku);
    writeDB(db);
    res.json({ success: true, message: "Buku berhasil dihapus!" });
});

// Jalankan server backend JavaScript
app.listen(PORT, () => {
    console.log(`Backend kelompokmu berjalan di http://localhost:${PORT}`);
});
