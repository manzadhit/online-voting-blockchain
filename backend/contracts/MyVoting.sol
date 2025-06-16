// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MyVoting {
  struct Vote {
    address voter;
    uint256 candidateId;
    uint256 electionId;
    uint256 timestamp;
  }

  Vote[] public allVotes;

  mapping(uint256 => mapping(address => bool)) public hasVoted; // _electionId => msg.sender => true/false

  mapping(uint256 => mapping(uint256 => uint256)) public voteCounts; // _electionId => _candidateId => count

  address public admin;

  event VotedCasted(address indexed voter, uint256 indexed candidateId, uint256 indexed electionId, uint256 timestamp);

  modifier onlyAdmin() {
    require(msg.sender == admin, "Only admin");
    _;
  }

  modifier hasNotVote(uint256 _electionId) {
    require(!hasVoted[_electionId][msg.sender], "Already voted ini this election");
    _;
  }

  constructor() {
    admin = msg.sender;
  }

  function vote(uint256 _candidateId, uint256 _electionId) public hasNotVote(_electionId) {
    Vote memory newVote = Vote({
      voter: msg.sender,
      candidateId: _candidateId,
      electionId: _electionId,
      timestamp: block.timestamp
    });

    allVotes.push(newVote);

    voteCounts[_electionId][_candidateId]++;
    hasVoted[_electionId][msg.sender] = true;

    emit VotedCasted(msg.sender, _candidateId, _electionId, block.timestamp);
  }

  function getElectionVoteCount(uint256 _electionId) public view returns (uint256) {
    uint256 count = 0;

    for(uint256 i = 0; i < allVotes.length; i++) {
      if(allVotes[i].electionId == _electionId) {
        count++;
      }
    }

    return count;
  }

  function getAllCandidateVoteCount(uint256 _electionId, uint256[] memory _candidateIds) public view returns (uint256[] memory) {
    uint256[] memory counts = new uint256[](_candidateIds.length);

    for(uint256 i = 0; i < _candidateIds.length; i++) {
      uint256 candidateId = _candidateIds[i];

      counts[i] = voteCounts[_electionId][candidateId];
    }

    return counts;
  }

  function changeAdmin(address _newAdmin) public onlyAdmin {
    admin = _newAdmin;
  }
}