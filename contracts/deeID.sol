pragma solidity ^0.5.0;

contract deeID {
    struct entity {
        uint entityType;
        address owner;
        string msgServer;
        bool approved;
    }

    struct key {
        string title;
        string key;
        bool status;
        string comment;
        address approver;
    }

    entity public omneeUser;
    address public owner;
    key[] public keys;

    // Constructor
    constructor (address _senderAddress) public {
        omneeUser.owner = _senderAddress;
        owner = msg.sender;
    }

    // Add a key to your contract
    // status is automatically set as active
    function addKey(string memory _title, string memory _key, string memory _comment) public {
        if(msg.sender == omneeUser.owner) {
            keys.push(key(_title, _key, true, _comment, address(0)));
        } 
    }

    function lenKeys() public returns (uint size) { return keys.length; }

    function getKey(uint _index) view public returns(string memory, string memory,
            bool status, string memory, address approver) {
        return (keys[_index].title, keys[_index].key, keys[_index].status,
            keys[_index].comment, keys[_index].approver);
    }

    function isApproved() view public returns (bool approved) {
        if(omneeUser.approved == true) return true;
        return false;
    }

    function msgServer() view public returns (string memory) {
        return omneeUser.msgServer;
    }

    function changeMsgServer(string memory _url) public returns (string memory){
        // to save gas we assume the user is using primary key
        if(msg.sender == omneeUser.owner) {
            omneeUser.msgServer = _url;
            return "Successful";
        } else {
            return "Do not have permission";
        }
    }

}
