const ABI = [
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
    name: "VotedCasted",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allVotes",
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
    name: "getAllCandidateVoteCount",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
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
        name: "_candidateId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_electionId",
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
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "voteCounts",
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
];

const CONTRACT_ADDRESS = "0xC2F16C259ED091Cd2f647c9632F44AC759f73120";

let signer;
let provider;
let contract;
let voterAddress;

const initBlockchain = () => {
  try {
    if (typeof window.ethereum !== "undefined") {
      provider = new ethers.BrowserProvider(window.ethereum);
      contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      return true;
    } else {
      console.log("MetaMask tidak ada, fitur blockchain tidak akan aktif.");
      alert("MetaMask tidak terdeteksi.");
      return false;
    }
  } catch (error) {
    console.error("Inisialisasi blockchain gagal:", error);
    return false;
  }
};

const connectMetaMask = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      voterAddress = await signer.getAddress();

      console.log("Terhubung dengan dompet:", voterAddress);
    } catch (error) {
      console.error("Pengguna menolak koneksi", error);
    }
  } else {
    alert("Metamask tidak terdeteksi");
  }
};

const checkIfAlreadyVoted = async (electionId, voter) => {
  return await contract.hasVoted(electionId, voter);
};

const vote = async (candidateId, electionId) => {
  if (!contract || !signer) {
    alert("Harap hubungkan dompet MetaMask anda terlebih dahulu!");
    return;
  }
  const tx = await contract.vote(candidateId, electionId);
  console.log(tx);

  const receipt = await tx.wait();
  console.log(receipt);

  return { tx, receipt };
};

const getElectionVoteCount = async (electionId) => {
  const count = await contract.getElectionVoteCount(electionId);

  return count;
};

const getAllCandidateVoteCount = async (electionId, candidateIds) => {
  const count = await contract.getAllCandidateVoteCount(
    electionId,
    candidateIds
  );

  return count;
};
