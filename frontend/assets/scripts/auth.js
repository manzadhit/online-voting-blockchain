document.addEventListener("DOMContentLoaded", function () {
  function checkAuth() {
    const userLogin = localStorage.getItem("userData");

    if (!userLogin) {
      redirectToLogin();
      return;
    }

    const userData = JSON.parse(userLogin);
    const currentPage = window.location.pathname;

    if (currentPage.includes("admin.html")) {
      if (!userData.username) {
        window.location.href = "login-admin.html";
        return;
      }
    }

    if (currentPage.includes("voting.html")) {
      if (!userData.nim) {
        window.location.href = "login.html";
        return;
      }
    }
  }

  function redirectToLogin() {
    const currentPage = window.location.pathname;

    if (currentPage.includes("admin.html")) {
      window.location.href = "login-admin.html";
      return;
    }

    window.location.href = "login.html";
  }

  checkAuth();

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("userData");
      redirectToLogin();
    });
  }
});
