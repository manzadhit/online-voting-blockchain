const CONTRACT_ADDRESS = "0x276a5f700a09DB1AeA3A875c5A6B94eF03B8Ed22"; // << GANTI DENGAN ALAMAT KONTRAK ANDA
const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "candidateId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "VoteCasted",
    type: "event",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newAdmin",
        type: "address",
      },
    ],
    name: "changeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllVotes",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "voter",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "candidateId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "electionId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct Voting.Vote[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "getCandidateVoteCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_candidateIds",
        type: "uint256[]",
      },
    ],
    name: "getElectionResults",
    outputs: [
      {
        internalType: "uint256[]",
        name: "candidateIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "voteCounts",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
    ],
    name: "getElectionVoteCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getVote",
    outputs: [
      {
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "candidateId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "getVotesByCandidate",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "voter",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "candidateId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "electionId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct Voting.Vote[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
    ],
    name: "getVotesByElection",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "voter",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "candidateId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "electionId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct Voting.Vote[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "getVotesByVoter",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "voter",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "candidateId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "electionId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct Voting.Vote[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasVoted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "hasVotedInElection",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "votes",
    outputs: [
      {
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "candidateId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

window.$(document).ready(function () {
  const userLogin = JSON.parse(localStorage.getItem("userData"));
  const voterId = userLogin?.id;

  // Display user info if logged in
  if (userLogin) {
    const initials = userLogin.name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");

    $(".user-avatar").text(initials);
    $(".user-details h4").text(userLogin.name);
    $(".user-details p:nth-child(2)").text(`NIM: ${userLogin.nim}`);
    $(".user-details p:nth-child(3)").text(`Fakultas: ${userLogin.faculty}`);
  }

  let electionId = null;
  let selectedCandidateId = null;
  let elections = [];

  // Fetch active elections
  $.ajax({
    url: "http://localhost:3000/voting/elections/active",
    method: "GET",
    dataType: "json",
    success: function (response) {
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

        // Set total voters
        $(".total-pemilih").html(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg> Total Pemilih: ${response.data.allVoter}
    `);
      } else {
        alert("Gagal mengambil data pemilihan");
      }
    },
    error: function () {
      alert("Terjadi kesalahan saat mengambil data pemilihan");
    },
  });

  // Handle election selection
  $("#activeElectionSelect").on("change", async function () {
    const rawVal = $(this).val();
    electionId = parseInt(rawVal, 10);
    if (isNaN(electionId)) return;

    localStorage.setItem("electionId", electionId);
    console.log("electionId:", electionId);

    // Check if user already voted (if MetaMask available)
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const voterAddress = await signer.getAddress();

          const alreadyVoted = await checkIfAlreadyVoted(
            electionId,
            voterAddress
          );

          if (alreadyVoted) {
            $("#vote-btn").prop("disabled", true).text("Anda Sudah Voting");
            $("#errorMessage").text(
              "Anda sudah melakukan voting untuk pemilihan ini."
            );
            $("#errorModal").css("display", "block");
            return;
          } else {
            $("#vote-btn").prop("disabled", false).text("Kirim Suara");
          }
        }
      } catch (error) {
        console.log("Could not check vote status:", error);
      }
    }

    // Find the selected election
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
      <svg ...></svg> Batas waktu: ${formattedEndDate}
    `);

    $(".waktu-tersisa").html(`
      <svg ...></svg> Waktu tersisa: ${diffDays} hari
    `);

    console.log("tes" + selectedElection.candidate);

    // Display candidates for this election
    displayCandidates(selectedElection.candidates);
  });

  // Function to display candidates
  function displayCandidates(candidates) {
    // Clear candidate list
    $(".candidate-list").empty();

    // Reset selected candidate
    selectedCandidateId = null;

    if (candidates.length === 0) {
      $(".candidate-list").html(
        '<div class="no-candidates">Tidak ada kandidat untuk pemilihan ini.</div>'
      );
      return;
    }

    // Add candidates to the list
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

      $(".candidate-list").append(card);
    });
  }

  // Function to check if user has already voted
  async function checkIfAlreadyVoted(electionId, voterAddress) {
    try {
      if (!window.ethereum) return false;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      const hasVoted = await contract.hasVotedInElection(
        electionId,
        voterAddress
      );
      return hasVoted;
    } catch (error) {
      console.error("Error checking vote status:", error);
      return false;
    }
  }

  // Helper function to generate initials if not provided
  function getInitials(name) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }

  // Saat kandidat diklik
  $(document).on("click", ".candidate-card", function () {
    $(".candidate-card").removeClass("selected"); // hapus seleksi sebelumnya
    $(this).addClass("selected"); // beri class selected
    selectedCandidateId = $(this).data("candidate-id"); // simpan id kandidat
  });

  // Saat tombol Kirim Suara ditekan
  $("#vote-btn").on("click", async function (e) {
    e.preventDefault();

    // Validation
    if (!selectedCandidateId || !voterId || !electionId) {
      $("#errorMessage").text(
        "Pastikan Anda memilih pemilihan dan kandidat terlebih dahulu."
      );
      $("#errorModal").css("display", "block");
      return;
    }

    // Check MetaMask
    if (!window.ethereum) {
      $("#errorMessage").text(
        "MetaMask tidak terdeteksi. Silakan install MetaMask terlebih dahulu."
      );
      $("#errorModal").css("display", "block");
      return;
    }

    try {
      // Disable button to prevent double voting
      $("#vote-btn").prop("disabled", true).text("Memproses...");

      // Connect to MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const voterAddress = await signer.getAddress();

      console.log("Connected address:", voterAddress);

      // Check if already voted
      const alreadyVoted = await checkIfAlreadyVoted(electionId, voterAddress);
      if (alreadyVoted) {
        $("#errorMessage").text(
          "Anda sudah melakukan voting untuk pemilihan ini."
        );
        $("#errorModal").css("display", "block");
        $("#vote-btn").prop("disabled", false).text("Kirim Suara");
        return;
      }

      // Create contract instance
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      // Convert IDs to numbers (smart contract expects uint256)
      const electionIdNum = parseInt(electionId);
      const candidateIdNum = parseInt(selectedCandidateId);

      console.log("Voting with:", { electionIdNum, candidateIdNum });

      // Send vote transaction
      const tx = await contract.vote(electionIdNum, candidateIdNum);
      console.log("Transaction sent:", tx.hash);

      // Show waiting modal
      $("#vote-btn").text("Menunggu Konfirmasi...");

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      // Save vote to backend (optional)
      // const payload = {
      //   voterId: voterId,
      //   candidateId: selectedCandidateId,
      //   electionId: electionId,
      //   txHash: tx.hash,
      //   blockNumber: receipt.blockNumber,
      //   voterAddress: voterAddress,
      // };

      // Optional: Send to your backend for record keeping
      // $.ajax({
      //   url: "http://localhost:3000/voting/vote",
      //   method: "POST",
      //   contentType: "application/json",
      //   data: JSON.stringify(payload),
      //   success: function (response) {
      //     console.log("Vote recorded in backend:", response);
      //   },
      //   error: function (error) {
      //     console.log("Backend recording failed:", error);
      //     // Continue anyway since blockchain vote succeeded
      //   },
      // });

      // Show success modal
      $("#successMessage").html(`
        <strong>Vote berhasil!</strong><br>
        Transaction Hash: ${tx.hash}<br>
        Block Number: ${receipt.blockNumber}
      `);
      $("#successModal").css("display", "block");

      // Disable voting button permanently
      $("#vote-btn").prop("disabled", true).text("Voting Selesai");
    } catch (error) {
      console.error("Voting error:", error);

      let errorMessage = "Terjadi kesalahan saat voting.";

      if (error.code === 4001) {
        errorMessage = "Transaksi dibatalkan oleh user.";
      } else if (error.code === -32603) {
        errorMessage = "Transaksi gagal. Mungkin Anda sudah voting sebelumnya.";
      } else if (error.message?.includes("Already voted")) {
        errorMessage = "Anda sudah melakukan voting untuk pemilihan ini.";
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Saldo ETH tidak mencukupi untuk gas fee.";
      }

      $("#errorMessage").text(errorMessage);
      $("#errorModal").css("display", "block");

      // Re-enable button
      $("#vote-btn").prop("disabled", false).text("Kirim Suara");
    }
  });

  // Modal close functionality
  $(".close, #errorOkBtn").on("click", function () {
    $(".modal").css("display", "none");
  });

  // Success modal redirect
  $("#successOkBtn").on("click", function () {
    window.location.href = "result.html";
  });

  // Close modal if clicking outside of it
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
});
