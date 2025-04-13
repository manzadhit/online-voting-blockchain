// Tempatkan script ini di setiap halaman yang memerlukan autentikasi
document.addEventListener("DOMContentLoaded", function () {
  // Fungsi untuk mengecek autentikasi
  function checkAuth() {
    const userLogin = localStorage.getItem("userData");
    console.log(userLogin);

    // Jika tidak ada userLogin, berarti belum login
    if (!userLogin) {
      redirectToLogin();
      return;
    }

    // Cek tipe user untuk halaman yang sesuai
    const userData = JSON.parse(userLogin);
    const currentPage = window.location.pathname;

    // Jika di halaman admin, pastikan user adalah admin (memiliki username)
    if (currentPage.includes("admin.html")) {
      if (!userData.username) {
        window.location.href = "loginAdmin.html";
        return;
      }
    }

    // Jika di halaman student/voter, pastikan user adalah student (memiliki nim)
    if (
      currentPage.includes("voting.html")
    ) {
      if (!userData.nim) {
        window.location.href = "login.html";
        return;
      }
    }
  }

  // Fungsi untuk mengarahkan ke halaman login yang sesuai
  function redirectToLogin() {
    const currentPage = window.location.pathname;

    // Jika mencoba mengakses halaman admin
    if (currentPage.includes("admin.html")) {
      window.location.href = "loginAdmin.html";
      return;
    }

    // Untuk halaman lain yang membutuhkan login
    window.location.href = "login.html";
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
      // Arahkan ke halaman login yang sesuai
      redirectToLogin();
    });
  }
});
