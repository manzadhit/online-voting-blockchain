$(document).ready(function () {
  // Smart Contract Configuration
  const VOTING_CONTRACT_ADDRESS = "0x276a5f700a09DB1AeA3A875c5A6B94eF03B8Ed22";
  const SEPOLIA_RPC_URL =
    "https://sepolia.infura.io/v3/bf10e9822870431286031ada9b853836";

  // Contract ABI - Anda perlu mengisi ini dengan ABI dari contract Voting
  const VOTING_CONTRACT_ABI = [
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

  let provider;
  let contract;

  // Initialize ethers connection
  async function initEthers() {
    try {
      provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      contract = new ethers.Contract(
        VOTING_CONTRACT_ADDRESS,
        VOTING_CONTRACT_ABI,
        provider
      );
      console.log("Ethers initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Ethers:", error);
    }
  }

  // Initialize ethers on page load
  initEthers();

  // Fetch active elections first
  $.ajax({
    url: "http://localhost:3000/voting/elections/active",
    method: "GET",
    success: function (response) {
      const activeElections = response.data.elections;

      // Populate dropdown with active elections
      const electionSelect = $("#electionSelect");
      activeElections.forEach((election) => {
        electionSelect.append(
          `<option value="${election.id}">${election.name}</option>`
        );
      });

      // If there are active elections, load the first one
      if (activeElections.length > 0) {
        loadElectionResults(parseInt(activeElections[0].id));
      }

      // Set from localStorage if available
      const savedElectionId = localStorage.getItem("electionId");
      if (savedElectionId) {
        const electionId = parseInt(savedElectionId);
        electionSelect.val(electionId);
        loadElectionResults(electionId);
      }
    },
    error: function (xhr, status, error) {
      console.error("Gagal mengambil data pemilihan aktif:", error, xhr);
      alert("Gagal memuat daftar pemilihan. Silakan coba lagi nanti.");
    },
  });

  // Handle dropdown change
  $("#electionSelect").change(function () {
    const selectedElectionId = parseInt($(this).val());
    localStorage.setItem("electionId", selectedElectionId.toString());
    loadElectionResults(selectedElectionId);
  });

  // Function to get blockchain voting data
  async function getBlockchainVotingData(electionId, candidateIds) {
    try {
      if (!contract) {
        console.error("Contract not initialized");
        return null;
      }

      // Get election results from smart contract
      const result = await contract.getElectionResults(
        electionId,
        candidateIds
      );

      // Get total votes for this election
      const totalVotes = await contract.getElectionVoteCount(electionId);

      // Get all votes for this election for transparency
      const allVotes = await contract.getVotesByElection(electionId);

      return {
        candidateIds: result[0], // candidateIds array
        voteCounts: result[1], // voteCounts array
        totalVotes: Number(totalVotes),
        allVotes: allVotes,
      };
    } catch (error) {
      console.error("Error getting blockchain data:", error);
      return null;
    }
  }

  // Function to load election results (modified)
  async function loadElectionResults(electionId) {
    const id = parseInt(electionId);
    console.log("Loading results for election ID:", id);

    if (isNaN(id)) {
      console.error("Invalid electionId:", electionId);
      alert("ID pemilihan tidak valid.");
      return;
    }

    try {
      // Get election data from backend first
      const response = await $.ajax({
        url: `http://localhost:3000/voting/result/${id}`,
        method: "GET",
      });

      const data = response.data;
      console.log("Backend data:", data);

      // Extract candidate IDs for blockchain query
      const candidateIds = data.candidates.map((c) => parseInt(c.id));
      console.log("Candidate IDs:", candidateIds);

      // Get blockchain data
      const blockchainData = await getBlockchainVotingData(id, candidateIds);

      if (blockchainData) {
        console.log("Blockchain data:", blockchainData);

        // Update candidates with blockchain vote counts
        for (let i = 0; i < candidateIds.length; i++) {
          const candidateId = candidateIds[i];
          const blockchainVoteCount = Number(blockchainData.voteCounts[i]);

          // Find candidate in backend data and update vote count
          const candidate = data.candidates.find(
            (c) => parseInt(c.id) === candidateId
          );
          if (candidate) {
            candidate.voteCount = blockchainVoteCount;

            // Recalculate percentage
            if (blockchainData.totalVotes > 0) {
              candidate.percentage = (
                (blockchainVoteCount / blockchainData.totalVotes) *
                100
              ).toFixed(1);
            } else {
              candidate.percentage = "0.0";
            }
          }
        }

        // Update total votes from blockchain
        data.totalVote = blockchainData.totalVotes;
      }

      // Display election statistics
      $(".election-name").text(data.electionName);
      $(".stat-box").eq(0).find(".stat-value").text(data.totalVote);
      $(".stat-box").eq(1).find(".stat-value").text(data.totalVoter);
      $(".stat-box")
        .eq(2)
        .find(".stat-value")
        .text(`${data.participationRate}%`);

      // Countdown
      $(".countdown-value").text(data.votingCountDown);

      // Render results table
      const tbody = $(".detail-table tbody");
      tbody.empty();

      // Sort candidates by vote count (descending)
      data.candidates.sort((a, b) => b.voteCount - a.voteCount);

      data.candidates.forEach((candidate, index) => {
        const candidateId = parseInt(candidate.id);
        const row = `
          <tr data-candidate-id="${candidateId}">
            <td>
              <span class="candidate-color color-${index + 1}"></span> ${
          candidate.mainName
        } & ${candidate.deputyName}
            </td>
            <td>${candidate.voteCount}</td>
            <td>${candidate.percentage}%</td>
            <td>${candidate.status}</td>
          </tr>
        `;
        tbody.append(row);
      });

      // Show blockchain verification status
      if (blockchainData) {
        console.log("✅ Data verified with blockchain");
      } else {
        console.warn("⚠️ Could not verify data with blockchain");
      }
    } catch (error) {
      console.error("Gagal mengambil data hasil voting:", error);
      alert("Gagal memuat hasil voting. Silakan coba lagi nanti.");
    }
  }
});
