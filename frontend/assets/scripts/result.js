$(document).ready(function () {
  let electionsData = [];
  let totalRegisteredVoters = 0;
  let countdownInterval;

  const init = async () => {
    if (initBlockchain()) {
      await loadActiveElections();
    }
  };

  const loadActiveElections = async () => {
    try {
      const response = await $.ajax({
        url: "http://localhost:3000/voting/elections/active",
        method: "GET",
        dataType: "json",
      });

      if (response.status === 200) {
        electionsData = response.data.elections;
        totalRegisteredVoters = response.data.allVoter;
        populateElectionDropdown(electionsData);
      } else {
        alert("Gagal mengambil data pemilihan dari server.");
      }
    } catch (error) {
      console.error("Error saat memuat data pemilihan:", error);
      alert("Terjadi kesalahan saat mengambil data pemilihan dari server.");
    }
  };

  const populateElectionDropdown = (elections) => {
    const selectElement = $("#electionSelect");
    selectElement.empty();
    selectElement.append(
      '<option value="" disabled selected>-- Pilih Pemilihan --</option>'
    );

    elections.forEach((election) => {
      selectElement.append(
        `<option value="${election.id}">${election.name}</option>`
      );
    });
  };

  const startCountdown = (endDateString) => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    const countdownElement = $(".countdown-value");
    const endTime = new Date(endDateString).getTime();

    countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(countdownInterval);
        countdownElement.text("Waktu Voting Telah Berakhir");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let displayString = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

      if (days > 0) {
        displayString = `${days} hari ${displayString}`;
      }

      countdownElement.text(displayString);
    }, 1000);
  };

  const displayResults = async (electionId) => {
    $(".detail-table tbody").html(
      '<tr><td colspan="4">Menghitung hasil dari blockchain...</td></tr>'
    );

    const selectedElection = electionsData.find((e) => e.id == electionId);
    if (!selectedElection) return;

    $(".election-name").text(selectedElection.name);
    startCountdown(selectedElection.endDate);

    if (selectedElection.candidates.length === 0) {
      $(".detail-table tbody").html(
        '<tr><td colspan="4">Tidak ada kandidat di pemilu ini.</td></tr>'
      );
      renderUI(selectedElection, [], 0, totalRegisteredVoters);
      return;
    }

    const candidateIds = selectedElection.candidates.map((c) => c.id);

    try {
      const voteCountsFromChain = await getAllCandidateVoteCount(
        electionId,
        candidateIds
      );

      let totalVotesInThisElection = 0;
      const candidatesWithVotes = selectedElection.candidates.map(
        (candidate, index) => {
          const voteCount = Number(voteCountsFromChain[index]);
          totalVotesInThisElection += voteCount;
          return { ...candidate, voteCount: voteCount };
        }
      );

      renderUI(
        selectedElection,
        candidatesWithVotes,
        totalVotesInThisElection,
        totalRegisteredVoters
      );
    } catch (error) {
      console.error("Gagal mengambil data dari smart contract:", error);
      $(".detail-table tbody").html(
        `<tr><td colspan="4">Gagal mengambil data dari blockchain: ${
          error.reason || error.message
        }</td></tr>`
      );
    }
  };

  const renderUI = (election, candidates, totalVotes, allVoters) => {
    const participationRate =
      allVoters > 0 ? ((totalVotes / allVoters) * 100).toFixed(2) : 0;

    $(".stat-box").eq(0).find(".stat-value").text(totalVotes);
    $(".stat-box").eq(1).find(".stat-value").text(allVoters);
    $(".stat-box").eq(2).find(".stat-value").text(`${participationRate}%`);

    const tbody = $(".detail-table tbody");
    tbody.empty();

    if (candidates.length === 0) return;

    candidates.sort((a, b) => b.voteCount - a.voteCount);

    candidates.forEach((candidate, index) => {
      const percentage =
        totalVotes > 0
          ? ((candidate.voteCount / totalVotes) * 100).toFixed(2)
          : 0;
      const status = index === 0 && candidate.voteCount > 0 ? "Memimpin" : "";

      const row = `
        <tr>
          <td><span class="candidate-color color-${index + 1}"></span> ${
        candidate.mainName
      }</td>
          <td>${candidate.voteCount}</td>
          <td>${percentage}%</td>
          <td>${status}</td>
        </tr>
      `;
      tbody.append(row);
    });
  };

  $("#electionSelect").on("change", function () {
    const selectedElectionId = $(this).val();
    if (selectedElectionId) {
      displayResults(selectedElectionId);
    }
  });

  init();
});
