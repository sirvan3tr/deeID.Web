pragma solidity ^0.5.0;

contract deeID {
    struct entity {
        uint entityType;
        address owner;
        string msgServer;
        string domain;
        bool approved;
    }

    struct key {
        string title;
        string key;
        bool status;
        string comment;
        address approver;
    }

    entity public deeIdUser;
    address public owner;
    key[] public keys;

    // Constructor
    //
    constructor (address _senderAddress) public {
        deeIdUser.owner = _senderAddress;
        owner = msg.sender;
    }

    // Add a key to your contract
    // status is automatically set as active
    //
    function addKey(string memory _title, string memory _key, string memory _comment) public {
        if(msg.sender == deeIdUser.owner) {
            keys.push(key(_title, _key, true, _comment, address(0)));
        }
    }

    // returns the length of keys array
    // i.e. number of keys stored
    //
    function lenKeys() public view returns (uint size) { return keys.length; }

    function getKey(uint _index) public view returns(string memory, string memory,
            bool status, string memory, address approver) {
        return (keys[_index].title, keys[_index].key, keys[_index].status,
            keys[_index].comment, keys[_index].approver);
    }

    function isApproved() public view returns (bool approved) {
        if(deeIdUser.approved == true) return true;
        return false;
    }

    function msgServer() public view returns (string memory) {
        return deeIdUser.msgServer;
    }

    function changeMsgServer(string memory _url) public returns (string memory){
        // to save gas we assume the user is using primary key
        if(msg.sender == deeIdUser.owner) {
            deeIdUser.msgServer = _url;
            return "Successful";
        } else {
            return "Do not have permission";
        }
    }

}
