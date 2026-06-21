// js/login.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginError = document.getElementById("loginError");
    const loginSuccess = document.getElementById("loginSuccess");

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Mencegah halaman reload secara default

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Reset status tampilan error/sukses dan validasi bootstrap
        loginError.classList.add("d-none");
        loginSuccess.classList.add("d-none");
        usernameInput.classList.remove("is-invalid");
        passwordInput.classList.remove("is-invalid");

        // Kirim data login ke API Backend Node.js
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Jika login sukses, tampilkan alert sukses
                loginSuccess.classList.remove("d-none");
                
                // Redirect ke dashboard sesuai dengan role dari database/backend
                setTimeout(() => {
                    if (data.role === 'admin') {
                        window.location.href = "admin/dashboard-admin.html";
                    } else if (data.role === 'anggota') {
                        window.location.href = "anggota/dashboard-anggota.html";
                    }
                }, 1000);
            } else {
                // Jika login gagal, tampilkan alert error dan beri warna merah pada input
                loginError.classList.remove("d-none");
                usernameInput.classList.add("is-invalid");
                passwordInput.classList.add("is-invalid");
            }
        })
        .catch(err => {
            console.error("Terjadi kesalahan sistem:", err);
            alert("Gagal terhubung ke server backend. Pastikan server Node.js sudah dinyalakan!");
        });
    });
});

// Fungsi global untuk melihat/menyembunyikan password (tetap dipertahankan)
window.togglePassword = function() {
    const passwordField = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");

    if (!passwordField || !eyeIcon) return;

    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
};
