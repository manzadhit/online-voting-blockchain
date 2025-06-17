// Gunakan $(document).ready() sebagai pengganti DOMContentLoaded
$(document).ready(function () {
  // --- Inisialisasi ---
  const currentUser = JSON.parse(localStorage.getItem("userData"));

  // Jika tidak ada data user, alihkan ke halaman login
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  // Fungsi utama untuk memuat halaman
  function initializePage() {
    loadUserData();
    setupEventListeners();
  }

  // --- Fungsi Logika ---

  function loadUserData() {
    // Update profile info dengan jQuery
    $("#profileName").text(currentUser.name);
    $("#profileNim").text(currentUser.nim);
    $("#profileFaculty").text(currentUser.faculty);
    $("#profileCreatedAt").text(formatDate(currentUser.createdAt));

    // Update avatar
    const initials = currentUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    $("#avatarCircle").text(initials);

    // Update status wallet
    updateWalletStatus();

    // Isi nilai form wallet
    $("#walletAddress").val(currentUser.walletAddress || "");

    // Disable wallet address input jika sudah ada dan valid
    checkAndDisableWalletInput();
  }

  function updateWalletStatus() {
    if (
      currentUser.walletAddress &&
      isValidWalletAddress(currentUser.walletAddress)
    ) {
      $("#walletStatus")
        .text("Terhubung")
        .removeClass("wallet-not-connected")
        .addClass("wallet-connected");
    } else {
      $("#walletStatus")
        .text("Belum Terhubung")
        .removeClass("wallet-connected")
        .addClass("wallet-not-connected");
    }
  }

  // Fungsi baru untuk mengecek dan disable wallet input
  function checkAndDisableWalletInput() {
    if (
      currentUser.walletAddress &&
      isValidWalletAddress(currentUser.walletAddress)
    ) {
      $("#walletAddress").prop("disabled", true).css({
        backgroundColor: "#f3f4f6",
        cursor: "not-allowed",
        opacity: "0.7",
      });

      // Tambahkan informasi bahwa wallet sudah terhubung
      if (!$("#walletConnectedInfo").length) {
        $("#walletAddress").after(
          '<small id="walletConnectedInfo" style="color: #16a34a; font-size: 0.8rem; display: block; margin-top: 5px;">✓ Alamat wallet sudah terhubung dan tidak dapat diubah</small>'
        );
      }
    } else {
      $("#walletAddress").prop("disabled", false).css({
        backgroundColor: "",
        cursor: "",
        opacity: "",
      });

      // Hapus informasi jika ada
      $("#walletConnectedInfo").remove();
    }
  }

  function isValidWalletAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  function showAlert(containerId, message, type = "success") {
    // Membuat elemen dengan jQuery
    const alertDiv = $("<div></div>")
      .addClass(`alert alert-${type}`)
      .text(message);

    // Menampilkan alert dan menghapusnya setelah 5 detik dengan efek fade
    $(`#${containerId}`).empty().append(alertDiv);
    setTimeout(() => {
      alertDiv.fadeOut(500, function () {
        $(this).remove();
      });
    }, 5000);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // --- Event Listeners dengan jQuery ---

  function setupEventListeners() {
    // Wallet form handlers
    $("#walletForm").on("submit", handleWalletSubmit);
    $("#resetWalletBtn").on("click", handleWalletReset);

    // Password form handlers
    $("#passwordForm").on("submit", handlePasswordSubmit);
    $("#resetPasswordBtn").on("click", handlePasswordReset);

    // Other handlers
    $("#logoutBtn").on("click", handleLogout);
    $("#walletAddress").on("input", validateWalletAddressInput);
    $("#confirmPassword").on("input", validatePasswordConfirmation);
    $("#newPassword").on("input", validateNewPassword);
  }

  // --- Wallet Management Functions ---

  function handleWalletSubmit(e) {
    e.preventDefault();

    // Cek apakah wallet address sudah terhubung
    if (
      currentUser.walletAddress &&
      isValidWalletAddress(currentUser.walletAddress)
    ) {
      showAlert(
        "walletAlertContainer",
        "Alamat wallet sudah terhubung dan tidak dapat diubah!",
        "warning"
      );
      return;
    }

    // Mengambil nilai form dengan .val()
    const walletAddress = $("#walletAddress").val().trim();
    const walletPassword = $("#walletPassword").val();

    // Validasi wallet address sebelum submit
    if (!walletAddress) {
      showAlert(
        "walletAlertContainer",
        "Alamat wallet tidak boleh kosong!",
        "error"
      );
      return;
    }

    if (!isValidWalletAddress(walletAddress)) {
      showAlert(
        "walletAlertContainer",
        "Format alamat wallet tidak valid!",
        "error"
      );
      return;
    }

    if (!walletPassword) {
      showAlert(
        "walletAlertContainer",
        "Password konfirmasi diperlukan!",
        "error"
      );
      return;
    }

    // Panggil fungsi untuk update wallet
    updateWalletAddress(walletAddress, walletPassword);
  }

  function updateWalletAddress(walletAddress, password) {
    const submitBtn = $('#walletForm button[type="submit"]');
    const originalText = submitBtn.text();
    submitBtn.text("Menyimpan...").prop("disabled", true);

    $.ajax({
      url: "http://localhost:3000/students/addWalletAddress",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        nim: currentUser.nim,
        walletAddress: walletAddress,
        password: password, // Tambahkan password untuk konfirmasi
      }),
      success: function (response) {
        showAlert(
          "walletAlertContainer",
          "Alamat wallet berhasil diperbarui dan terhubung!",
          "success"
        );

        // Update data di localStorage dan UI
        currentUser.walletAddress = walletAddress;
        localStorage.setItem("userData", JSON.stringify(currentUser));
        updateWalletStatus();
        checkAndDisableWalletInput();

        // Clear password field
        $("#walletPassword").val("");
      },
      error: function (xhr) {
        let userMessage = "Terjadi kesalahan. Silakan coba lagi.";

        if (xhr.responseJSON && xhr.responseJSON.message) {
          const serverMessage = xhr.responseJSON.message;

          if (serverMessage.includes("Voter already whitelisted")) {
            userMessage =
              "Alamat wallet ini sudah terdaftar dan di-whitelist sebelumnya.";
          } else if (serverMessage.includes("sudah terdaftar")) {
            userMessage =
              "Alamat wallet ini sudah terdaftar oleh pengguna lain.";
          } else if (serverMessage.includes("Password")) {
            userMessage = "Password yang Anda masukkan salah.";
          } else {
            userMessage = serverMessage;
          }
        }

        showAlert("walletAlertContainer", userMessage, "error");
      },
      complete: function () {
        submitBtn.text(originalText).prop("disabled", false);
      },
    });
  }

  function handleWalletReset() {
    if (confirm("Apakah Anda yakin ingin mereset form wallet?")) {
      $("#walletForm")[0].reset();
      $("#walletAlertContainer").empty();
      loadUserData(); // Reload wallet data
    }
  }

  // --- Password Management Functions ---

  function handlePasswordSubmit(e) {
    e.preventDefault();

    const currentPassword = $("#currentPassword").val();
    const newPassword = $("#newPassword").val();
    const confirmPassword = $("#confirmPassword").val();

    // Validasi form
    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert(
        "passwordAlertContainer",
        "Silakan lengkapi semua field password!",
        "error"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert(
        "passwordAlertContainer",
        "Konfirmasi password tidak cocok!",
        "error"
      );
      return;
    }

    if (newPassword.length < 8) {
      showAlert(
        "passwordAlertContainer",
        "Password baru harus minimal 8 karakter!",
        "error"
      );
      return;
    }

    if (currentPassword === newPassword) {
      showAlert(
        "passwordAlertContainer",
        "Password baru harus berbeda dengan password lama!",
        "error"
      );
      return;
    }

    // Validasi kompleksitas password
    if (!isStrongPassword(newPassword)) {
      showAlert(
        "passwordAlertContainer",
        "Password harus mengandung kombinasi huruf besar, huruf kecil, angka, dan simbol!",
        "error"
      );
      return;
    }

    // Panggil fungsi untuk reset password
    resetPassword(currentPassword, newPassword);
  }

  function resetPassword(oldPassword, newPassword) {
    const submitBtn = $('#passwordForm button[type="submit"]');
    const originalText = submitBtn.text();
    submitBtn.text("Sedang Memproses...").prop("disabled", true);

    $.ajax({
      url: "http://localhost:3000/students/reset-password",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        nim: currentUser.nim,
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
      success: function (response) {
        showAlert(
          "passwordAlertContainer",
          "Password berhasil diubah! Silakan login ulang dengan password baru.",
          "success"
        );

        // Clear form setelah berhasil
        $("#passwordForm")[0].reset();

        // Optional: Auto logout setelah berhasil ganti password
        setTimeout(() => {
          if (
            confirm(
              "Password berhasil diubah. Apakah Anda ingin login ulang sekarang?"
            )
          ) {
            localStorage.removeItem("userData");
            window.location.href = "login.html";
          }
        }, 2000);
      },
      error: function (xhr) {
        let userMessage = "Terjadi kesalahan. Silakan coba lagi.";

        if (xhr.status === 404) {
          userMessage = "Data pengguna tidak ditemukan.";
        } else if (xhr.status === 401) {
          userMessage = "Password lama tidak benar.";
        } else if (xhr.responseJSON && xhr.responseJSON.message) {
          userMessage = xhr.responseJSON.message;
        }

        showAlert("passwordAlertContainer", userMessage, "error");
      },
      complete: function () {
        submitBtn.text(originalText).prop("disabled", false);
      },
    });
  }

  function handlePasswordReset() {
    if (confirm("Apakah Anda yakin ingin mereset form password?")) {
      $("#passwordForm")[0].reset();
      $("#passwordAlertContainer").empty();
    }
  }

  // --- Fungsi Validasi Input ---

  function validateWalletAddressInput() {
    // Jangan validasi jika input sudah disabled
    if ($(this).prop("disabled")) {
      return;
    }

    const address = $(this).val().trim();
    if (address && !isValidWalletAddress(address)) {
      $(this).css("borderColor", "#dc2626");
    } else {
      $(this).css("borderColor", "#e5e7eb");
    }
  }

  function validatePasswordConfirmation() {
    const newPass = $("#newPassword").val();
    const confirmPass = $(this).val();
    if (confirmPass && newPass !== confirmPass) {
      $(this).css("borderColor", "#dc2626");
    } else {
      $(this).css("borderColor", "#e5e7eb");
    }
  }

  function validateNewPassword() {
    const password = $(this).val();
    if (password && !isStrongPassword(password)) {
      $(this).css("borderColor", "#dc2626");
    } else {
      $(this).css("borderColor", "#e5e7eb");
    }
  }

  function isStrongPassword(password) {
    // Minimal 8 karakter, harus ada huruf besar, huruf kecil, angka, dan simbol
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    return (
      hasUpperCase && hasLowerCase && hasNumbers && hasSymbols && hasMinLength
    );
  }

  // --- Fungsi Tombol Lainnya ---

  function handleLogout(e) {
    e.preventDefault();
    // console.log("testing");
    
    if (confirm("Apakah Anda yakin ingin logout?")) {
      showAlert(
        "walletAlertContainer",
        "Logout berhasil. Mengalihkan...",
        "success"
      );
      setTimeout(() => {
        localStorage.removeItem("userData");
        window.location.href = "login.html";
      }, 1500);
    }
  }

  // Panggil fungsi inisialisasi
  initializePage();
});
