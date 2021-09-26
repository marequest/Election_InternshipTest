pragma solidity >= 0.6.0 <= 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WakandaContract {

    address private owner;

    struct Candidate {
        uint id;
        string name;
        string age;
        string cult;
        uint voteCount;
    }

    struct Voter{
        bool hasVoted;
        uint candidateId;
    }

    mapping(address=>bool) public registeredVoter;
    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;

    mapping(uint => bool) public challengers;

    Candidate[] public top3;


    uint public candidatesCount;


    event VoterRegistered(address _voter);
    event votedEvent (uint indexed _candidateId);
    event NewChallenger(uint indexed _candidateId);

    function addCandidate (string memory _name, string memory _age, string memory _cult) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _age, _cult, 0);
    }

    constructor() payable{
        owner = msg.sender;

        addCandidate("Oneza Umbadi", "56", "White Gorilla Cult");
        addCandidate("K'Tashe Khotare", "age", "Lion Cult");
        addCandidate("W'Kasse Zomvu", "67", "Lion Cult");
        addCandidate("Amwea Thembunu", "72", "White Gorilla Cult");
        addCandidate("Ch'Tahni Chite", "39", "White Gorilla Cult");
        addCandidate("Mbosha Tabi", "31", "Lion Cult");
        addCandidate("Kwantak Buzakhi", "65", "Hyena Clan");
        addCandidate("Omeru Khibanda", "43", "Panther Cult");
        addCandidate("Iwi Tamva", "72", "Crocodile Cult");
        addCandidate("Jodi Tazediba", "38", "White Gorilla Cult");

        challengers[0] = false;
        challengers[1] = false;
        challengers[2] = false;
    }

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(voters[msg.sender].hasVoted == false, "Voter already voted!");
        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Candidate not valid!");

        // record that voter has voted
        voters[msg.sender].hasVoted = true;
        // A Smart Contract that keeps track of who voted for which candidates
        voters[msg.sender].candidateId = _candidateId;

        // update candidate vote Count
        candidates[_candidateId].voteCount++;


        if(challengers[2] == false){ // first three candidates
            if(challengers[1] == false){
                if(challengers[0] == false){
                    top3.push(candidates[_candidateId]);
                    challengers[0] = true;

                    emit NewChallenger(_candidateId);
                } else {
                    if(candidates[_candidateId].id != top3[0].id){
                        top3.push(candidates[_candidateId]);
                        challengers[1] = true;

                        emit NewChallenger(_candidateId);
                    }
                }
            } else {
                if(candidates[_candidateId].id == top3[0].id || candidates[_candidateId].id == top3[1].id){
                    if(candidates[_candidateId].voteCount > top3[0].voteCount){
                        uint temp = top3[0].id;
                        top3[0] = candidates[_candidateId];
                        top3[1] = candidates[temp];
                    } else {
                        top3[1] = candidates[_candidateId];
                    }
                } else {
                    top3.push(candidates[_candidateId]);
                    challengers[2] = true;

                    emit NewChallenger(_candidateId);
                }
            }
        } else { // if there are already first three candidates by votes
            uint place = candidates[_candidateId].voteCount;
            if(place > top3[2].voteCount){
                if(place > top3[1].voteCount){
                    if(place > top3[0].voteCount){
                        uint temp1 = top3[0].id;
                        top3[0] = candidates[_candidateId];
                        uint temp2 = top3[1].id;
                        top3[1] = candidates[temp1];
                        top3[2] = candidates[temp2];
                    } else {
                        uint temp = top3[1].id;
                        top3[1] = candidates[_candidateId];
                        top3[2] = candidates[temp];
                    }
                } else {
                    top3[2] = candidates[_candidateId];

                    emit NewChallenger(_candidateId);
                }
            }
        }

        emit votedEvent(_candidateId);
    }

    function registerVoter(address _voter) external {
        require(registeredVoter[_voter] == false, "WakandaContract:: Voter already registered");
        registeredVoter[_voter] = true;

        emit VoterRegistered(_voter);
    }

    function winningCandidates() external returns(string memory, string memory, string memory){
        //TODO Returns the top 3 candidates by vote count
        if(challengers[2] == false){
            if(challengers[1] == false){
                if(challengers[0] == false){
                    return ('', '', '');
                } else {
                    return (append(top3[0].name, ", votes: ", uint2str(top3[0].voteCount)), '', '');
                }
            } else {
                return (append(top3[0].name, ", votes: ", uint2str(top3[0].voteCount)),
                append(top3[1].name, ", votes: ", uint2str(top3[1].voteCount)), '');
            }
        } else {
            return (append(top3[0].name, ", votes: ", uint2str(top3[0].voteCount)),
            append(top3[1].name, ", votes: ", uint2str(top3[1].voteCount)),
            append(top3[2].name, ", votes: ", uint2str(top3[2].voteCount)));
        }
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function append(string memory a, string memory b, string memory c) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b, c));
    }
}
