// Tempatkan script ini di setiap halaman yang memerlukan autentikasi
document.addEventListener("DOMContentLoaded", function () {
  // Fungsi untuk mengecek autentikasi
  function checkAuth() {
    const userLogin = localStorage.getItem("userData");
    console.log(userLogin);
    
    // Jika tidak ada userLogin, berarti belum login
    if (!userLogin) {
      // Tentukan jenis halaman saat ini
      const currentPage = window.location.pathname;

      // Jika mencoba mengakses halaman admin
      if (currentPage.includes("admin.html")) {
        window.location.href = "loginAdmin.html";
        return;
      }

      // Untuk halaman lain yang membutuhkan login
      window.location.href = "login.html";
    }
  }

  // Jalankan pengecekan otentikasi
  checkAuth();

  // Menangani logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      // Hapus token autentikasi
      localStorage.removeItem("userData");
      // Arahkan ke halaman login
      const currentPage = window.location.pathname;

      // Jika mencoba mengakses halaman admin
      if (currentPage.includes("admin.html")) {
        window.location.href = "loginAdmin.html";
        return;
      }

      // Untuk halaman lain yang membutuhkan login
      window.location.href = "login.html";
    });
  }
});
