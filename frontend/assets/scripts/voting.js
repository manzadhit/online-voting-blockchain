$(document).ready(function () {
  // --- Inisialisasi Variabel ---
  const userLogin = JSON.parse(localStorage.getItem("userData"));

  // Redirect jika tidak login
  if (!userLogin) {
    window.location.href = "login.html";
    return;
  }

  let electionId = null;
  let selectedCandidateId = null;
  let elections = [];

  // --- Fungsi Inisialisasi Utama ---
  const initializePage = () => {
    // Panggil initBlockchain dari blockchain.js untuk koneksi read-only awal
    if (typeof initBlockchain === "function") {
      initBlockchain();
    }
    loadActiveElections();
    setupEventListeners();
    displayUserInfo();
  };

  // --- Fungsi Tampilan & Logika UI ---
  const displayUserInfo = () => {
    const initials = userLogin.name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");

    $(".user-avatar").text(initials);
    $(".user-details h4").text(userLogin.name);
    $(".user-details p:nth-child(2)").text(`NIM: ${userLogin.nim}`);
    $(".user-details p:nth-child(3)").text(`Fakultas: ${userLogin.faculty}`);
  };

  const loadActiveElections = async () => {
    try {
      const response = await $.ajax({
        url: "http://localhost:3000/voting/elections/active",
        method: "GET",
        dataType: "json",
      });

      if (response.status === 200) {
        elections = response.data.elections;

        // Populate election dropdown
        const selectElement = $("#activeElectionSelect");
        selectElement.empty();
        selectElement.append(
          '<option value="" disabled selected>-- Pilih Pemilihan --</option>'
        );

        elections.forEach((election) => {
          selectElement.append(
            `<option value="${election.id}">${election.name}</option>`
          );
        });

        // Set total voters with SVG icon
        $(".total-pemilih").html(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg> Total Pemilih: ${response.data.allVoter}
        `);
      } else {
        showError("Gagal mengambil data pemilihan");
      }
    } catch (error) {
      console.error("Error loading elections:", error);
      showError("Terjadi kesalahan saat mengambil data pemilihan");
    }
  };

  const displayCandidates = (candidates) => {
    const candidateList = $(".candidate-list");
    candidateList.empty();
    selectedCandidateId = null; // Reset pilihan

    if (!candidates || candidates.length === 0) {
      candidateList.html(
        '<div class="no-candidates">Tidak ada kandidat untuk pemilihan ini.</div>'
      );
      return;
    }

    candidates.forEach((candidate) => {
      const card = `
        <div class="candidate-card" data-candidate-id="${candidate.id}">
          <div class="candidate-wrapper">
            <div class="candidate-photos">
              <div class="candidate-photo">${
                candidate.mainInitials || getInitials(candidate.mainName)
              }</div>
              <div class="candidate-photo deputy">${
                candidate.deputyInitials || getInitials(candidate.deputyName)
              }</div>
            </div>
            <div class="candidate-info">
              <div class="candidate-pair">${candidate.mainName.trim()} & ${candidate.deputyName.trim()}</div>
              <div class="candidate-faculty">
                ${candidate.mainFaculty} & ${candidate.deputyFaculty}
              </div>
            </div>
            <div class="candidate-select"></div>
          </div>
          <div class="candidate-vision">
            <strong>Visi:</strong> ${candidate.vision}
          </div>
        </div>
      `;
      candidateList.append(card);
    });
  };

  // Helper function to generate initials
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  // --- Fungsi Validasi (Async) ---
  const validateConnectedAccount = async () => {
    const currentUser = JSON.parse(localStorage.getItem("userData"));
    const registeredAddress = currentUser?.walletAddress;

    // Pastikan voterAddress sudah tersedia dari blockchain.js
    if (typeof voterAddress === "undefined" || !voterAddress) {
      throw new Error(
        "Alamat dompet belum terhubung. Silakan hubungkan MetaMask terlebih dahulu."
      );
    }

    const connectedAddress = voterAddress;

    if (!registeredAddress) {
      throw new Error("Anda belum mendaftarkan alamat dompet di profil Anda.");
    }

    if (registeredAddress.toLowerCase() !== connectedAddress.toLowerCase()) {
      throw new Error(`
        <strong>Akun Salah!</strong><br>
        Akun yang terhubung di MetaMask (<span class="address">${connectedAddress}</span>) 
        tidak cocok dengan akun yang Anda daftarkan (<span class="address">${registeredAddress}</span>).
        <br><br>
        Silakan buka MetaMask dan ganti ke akun yang benar.
      `);
    }

    return true;
  };

  // --- Event Listeners ---
  const setupEventListeners = () => {
    // Handle election selection
    $("#activeElectionSelect").on("change", async function () {
      const rawVal = $(this).val();
      electionId = parseInt(rawVal, 10);

      if (isNaN(electionId)) return;

      localStorage.setItem("electionId", electionId);

      // Check if user already voted (if blockchain connection available)
      if (
        typeof window.ethereum !== "undefined" &&
        typeof checkIfAlreadyVoted === "function"
      ) {
        try {
          if (typeof voterAddress !== "undefined" && voterAddress) {
            const alreadyVoted = await checkIfAlreadyVoted(
              electionId,
              voterAddress
            );

            if (alreadyVoted) {
              $("#vote-btn").prop("disabled", true).text("Anda Sudah Voting");
              showError("Anda sudah melakukan voting untuk pemilihan ini.");
              return;
            } else {
              $("#vote-btn").prop("disabled", false).text("Kirim Suara");
            }
          }
        } catch (error) {
          console.log("Could not check vote status:", error);
        }
      }

      // Find and display selected election
      const selectedElection = elections.find((e) => e.id === electionId);
      if (!selectedElection) return;

      // Update election information
      $(".election-info h3").text(selectedElection.name);

      // Format end date
      const endDate = new Date(selectedElection.endDate);
      const today = new Date();
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const options = { day: "numeric", month: "long", year: "numeric" };
      const formattedEndDate = endDate.toLocaleDateString("id-ID", options);

      $(".batas-waktu").html(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12,6 12,12 16,14"></polyline>
        </svg> Batas waktu: ${formattedEndDate}
      `);

      $(".waktu-tersisa").html(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12,6 12,12 16,14"></polyline>
        </svg> Waktu tersisa: ${diffDays} hari
      `);

      // Display candidates for this election
      displayCandidates(selectedElection.candidates);
    });

    // Handle candidate selection
    $(document).on("click", ".candidate-card", function () {
      $(".candidate-card").removeClass("selected");
      $(this).addClass("selected");
      selectedCandidateId = $(this).data("candidate-id");
    });

    // Handle vote button (SINGLE EVENT LISTENER)
    $("#vote-btn").on("click", handleVote);

    // Modal close functionality
    $(".close, #errorOkBtn").on("click", function () {
      $(".modal").css("display", "none");
    });

    // Success modal redirect
    $("#successOkBtn").on("click", function () {
      window.location.href = "result.html";
    });

    // Close modal when clicking outside
    $(window).on("click", function (event) {
      if ($(event.target).hasClass("modal")) {
        $(".modal").css("display", "none");
      }
    });

    // Handle logout
    $("#logoutBtn").on("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("userData");
      localStorage.removeItem("electionId");
      window.location.href = "login.html";
    });
  };

  // --- Handler Utama untuk Aksi Vote ---
  const handleVote = async () => {
    const voteButton = $("#vote-btn");
    voteButton.prop("disabled", true).text("Memproses...");

    try {
      // 1. Validasi input UI
      if (!selectedCandidateId || !electionId) {
        throw new Error(
          "Pastikan Anda memilih pemilihan dan kandidat terlebih dahulu."
        );
      }

      // 2. Check MetaMask availability
      if (typeof window.ethereum === "undefined") {
        throw new Error(
          "MetaMask tidak terdeteksi. Silakan install MetaMask terlebih dahulu."
        );
      }

      // 3. Connect wallet if not connected
      if (typeof signer === "undefined" || !signer) {
        if (typeof connectWalletAndGetSigner === "function") {
          const isConnected = await connectWalletAndGetSigner();
          if (!isConnected) {
            throw new Error("Koneksi dompet dibatalkan atau gagal.");
          }
        } else {
          throw new Error("Fungsi koneksi dompet tidak tersedia.");
        }
      }

      // 4. Validate connected account
      await validateConnectedAccount();

      // 5. Check whitelist status
      if (
        typeof contract !== "undefined" &&
        contract &&
        typeof contract.isWhitelisted === "function"
      ) {
        const isWhitelisted = await contract.isWhitelisted(voterAddress);
        if (!isWhitelisted) {
          throw new Error(
            "Alamat Anda belum terdaftar (whitelisted) untuk voting."
          );
        }
      }

      // 6. Check if already voted
      if (typeof checkIfAlreadyVoted === "function") {
        const alreadyVoted = await checkIfAlreadyVoted(
          electionId,
          voterAddress
        );
        if (alreadyVoted) {
          throw new Error("Anda sudah melakukan voting untuk pemilihan ini.");
        }
      }

      // 7. Send vote transaction
      console.log("Meminta konfirmasi transaksi dari MetaMask...");

      if (typeof vote !== "function") {
        throw new Error("Fungsi voting tidak tersedia.");
      }

      const result = await vote(selectedCandidateId, electionId);

      // 8. Handle success
      console.log("Vote berhasil dikonfirmasi!", result.receipt);

      $("#successMessage").html(`
        <strong>Vote berhasil!</strong><br>
        Transaction Hash: ${result.receipt.transactionHash}<br>
        Block Number: ${result.receipt.blockNumber}
      `);
      $("#successModal").css("display", "block");

      voteButton.prop("disabled", true).text("Voting Selesai");
    } catch (error) {
      // 9. Centralized error handling
      console.error("Proses voting gagal:", error);

      let errorMessage =
        error.reason ||
        error.message ||
        "Terjadi kesalahan yang tidak diketahui.";

      if (error.code === 4001) {
        errorMessage = "Transaksi dibatalkan oleh Anda.";
      }

      // Display error message (support HTML)
      $("#errorMessage").html(errorMessage);
      $("#errorModal").css("display", "block");

      // Set button state based on error type
      if (errorMessage.includes("Anda sudah melakukan voting")) {
        voteButton.prop("disabled", true).text("Sudah Voting");
      } else {
        voteButton.prop("disabled", false).text("Kirim Suara");
      }
    }
  };

  // --- Utility Functions ---
  const showError = (message) => {
    $("#errorMessage").html(message);
    $("#errorModal").css("display", "block");
  };

  // --- Initialize Application ---
  initializePage();
});
