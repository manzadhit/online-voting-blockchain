// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    struct Vote {
        address voter;        // Siapa yang voting
        uint256 candidateId;  // Siapa yang divoting  
        uint256 electionId;   // Di election mana
        uint256 timestamp;    // Kapan voting
    }

    // Storage utama - hanya votes
    Vote[] public votes;
    
    // Mapping untuk prevent double voting
    mapping(uint256 => mapping(address => bool)) public hasVoted; // electionId => voter => hasVoted
    
    // Admin untuk emergency/maintenance
    address public admin;
    
    event VoteCasted(address indexed voter, uint256 indexed candidateId, uint256 indexed electionId, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * Fungsi utama - hanya untuk voting
     * Validasi election/candidate/student dilakukan di backend sebelum memanggil fungsi ini
     */
    function vote(uint256 _electionId, uint256 _candidateId) public {
        require(!hasVoted[_electionId][msg.sender], "Already voted in this election");
        
        // Record vote
        votes.push(Vote({
            voter: msg.sender,
            candidateId: _candidateId,
            electionId: _electionId,
            timestamp: block.timestamp
        }));

        // Mark as voted
        hasVoted[_electionId][msg.sender] = true;

        emit VoteCasted(msg.sender, _candidateId, _electionId, block.timestamp);
    }

    // === VIEW FUNCTIONS ===

    /**
     * Get single vote by index
     */
    function getVote(uint256 _index) public view returns (
        address voter,
        uint256 candidateId,
        uint256 electionId,
        uint256 timestamp
    ) {
        require(_index < votes.length, "Vote does not exist");
        Vote storage v = votes[_index];
        return (v.voter, v.candidateId, v.electionId, v.timestamp);
    }

    /**
     * Get all votes - untuk audit/transparency
     */
    function getAllVotes() public view returns (Vote[] memory) {
        return votes;
    }

    /**
     * Get votes by election ID
     */
    function getVotesByElection(uint256 _electionId) public view returns (Vote[] memory) {
        uint256 count = 0;
        
        // Count votes for this election
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].electionId == _electionId) {
                count++;
            }
        }
        
        // Create array with exact size
        Vote[] memory electionVotes = new Vote[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].electionId == _electionId) {
                electionVotes[index] = votes[i];
                index++;
            }
        }
        
        return electionVotes;
    }

    /**
     * Get votes by voter address
     */
    function getVotesByVoter(address _voter) public view returns (Vote[] memory) {
        uint256 count = 0;
        
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].voter == _voter) {
                count++;
            }
        }
        
        Vote[] memory voterVotes = new Vote[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].voter == _voter) {
                voterVotes[index] = votes[i];
                index++;
            }
        }
        
        return voterVotes;
    }

    /**
     * Get votes by candidate ID
     */
    function getVotesByCandidate(uint256 _candidateId) public view returns (Vote[] memory) {
        uint256 count = 0;
        
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].candidateId == _candidateId) {
                count++;
            }
        }
        
        Vote[] memory candidateVotes = new Vote[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].candidateId == _candidateId) {
                candidateVotes[index] = votes[i];
                index++;
            }
        }
        
        return candidateVotes;
    }

    // === COUNT FUNCTIONS ===

    /**
     * Total votes in system
     */
    function getTotalVotes() public view returns (uint256) {
        return votes.length;
    }

    /**
     * Count votes for specific election
     */
    function getElectionVoteCount(uint256 _electionId) public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].electionId == _electionId) {
                count++;
            }
        }
        return count;
    }

    /**
     * Count votes for specific candidate
     */
    function getCandidateVoteCount(uint256 _candidateId) public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].candidateId == _candidateId) {
                count++;
            }
        }
        return count;
    }

    /**
     * Get election results - returns candidate IDs and their vote counts
     */
    function getElectionResults(uint256 _electionId, uint256[] memory _candidateIds) 
        public 
        view 
        returns (uint256[] memory candidateIds, uint256[] memory voteCounts) 
    {
        candidateIds = _candidateIds;
        voteCounts = new uint256[](_candidateIds.length);
        
        for (uint256 i = 0; i < _candidateIds.length; i++) {
            voteCounts[i] = 0;
            for (uint256 j = 0; j < votes.length; j++) {
                if (votes[j].electionId == _electionId && votes[j].candidateId == _candidateIds[i]) {
                    voteCounts[i]++;
                }
            }
        }
        
        return (candidateIds, voteCounts);
    }

    /**
     * Check if address has voted in specific election
     */
    function hasVotedInElection(uint256 _electionId, address _voter) public view returns (bool) {
        return hasVoted[_electionId][_voter];
    }

    // === ADMIN FUNCTIONS ===

    /**
     * Emergency function to pause/reset if needed
     */
    function changeAdmin(address _newAdmin) public onlyAdmin {
        admin = _newAdmin;
    }
}