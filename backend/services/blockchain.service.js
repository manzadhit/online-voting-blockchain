const { ethers } = require("ethers");
const votingABI = require("../artifacts/contracts/EVoting.sol/Voting.json").abi;

class BlockchainService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
    );
    this.wallet = new ethers.Wallet(
      process.env.SEPOLIA_PRIVATE_KEY,
      this.provider
    );
    this.contractAddress = process.env.VOTING_CONTRACT_ADDRESS;
    this.contract = new ethers.Contract(
      this.contractAddress,
      votingABI,
      this.wallet
    );
  }

  async vote(electionId, candidateId) {
    try {
      const tx = await this.contract.vote(electionId, candidateId);
      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (error) {
      throw new Error(`Failed to vote: ${error.message}`);
    }
  }

  async hasVoted(electionId, voterAddress) {
    console.log("election id: " + electionId + "voteradres: " + voterAddress);
    try {
      const voted = await this.contract.hasVotedInElection(
        electionId,
        voterAddress
      );
      return voted;
    } catch (error) {
      throw new Error(`Failed to check vote status: ${error.message}`);
    }
  }

  async getCandidateVoteCount(candidateId) {
    try {
      const count = await this.contract.getCandidateVoteCount(candidateId);
      return parseInt(count.toString());
    } catch (error) {
      throw new Error(`Failed to get vote count: ${error.message}`);
    }
  }

  async getElectionVoteCount(electionId) {
    try {
      const count = await this.contract.getElectionVoteCount(electionId);
      return parseInt(count.toString());
    } catch (error) {
      throw new Error(`Failed to get election vote count: ${error.message}`);
    }
  }

  async getElectionResults(electionId, candidateIds) {
    try {
      const results = await this.contract.getElectionResults(
        electionId,
        candidateIds
      );
      return {
        candidateIds: results[0].map((id) => id.toString()),
        voteCounts: results[1].map((count) => parseInt(count.toString())),
      };
    } catch (error) {
      throw new Error(`Failed to get election results: ${error.message}`);
    }
  }

  async getVotesByElection(electionId) {
    try {
      const votes = await this.contract.getVotesByElection(electionId);
      return votes.map((vote) => ({
        voter: vote.voter,
        candidateId: vote.candidateId.toString(),
        electionId: vote.electionId.toString(),
        timestamp: parseInt(vote.timestamp.toString()),
      }));
    } catch (error) {
      throw new Error(`Failed to get votes by election: ${error.message}`);
    }
  }

  async getAllVotes() {
    try {
      const votes = await this.contract.getAllVotes();
      return votes.map((vote) => ({
        voter: vote.voter,
        candidateId: vote.candidateId.toString(),
        electionId: vote.electionId.toString(),
        timestamp: parseInt(vote.timestamp.toString()),
      }));
    } catch (error) {
      throw new Error(`Failed to get all votes: ${error.message}`);
    }
  }

  async getTotalVotes() {
    try {
      const count = await this.contract.getTotalVotes();
      return parseInt(count.toString());
    } catch (error) {
      throw new Error(`Failed to get total votes: ${error.message}`);
    }
  }

  async getTransactionDetails(txHash) {
    try {
      const tx = await this.provider.getTransaction(txHash);
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return { transaction: tx, receipt: receipt };
    } catch (error) {
      throw new Error(`Failed to get transaction details: ${error.message}`);
    }
  }
}

module.exports = new BlockchainService();
