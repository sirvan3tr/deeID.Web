pragma solidity ^0.5.0;
import "./deeID.sol";

contract deeIDPortal {
    mapping (address => address) public directory;
    address public usersDID; // tmp store to retrieve id of new con'
    
    // Create a new identity
    function createID() public returns (bool status_, address newID_) {
        if (directory[msg.sender] == address(0)) {
            deeID newDID = new deeID(msg.sender);
            address newID = address(newDID);
            directory[msg.sender] = newID;
            usersDID = directory[msg.sender];
            return (true, newID);
        } else {
            return (false, address(0));
        }
    }

    // Id of my contract
    function id() public view returns(address) { return directory[msg.sender]; }

    // Returns the users contract address
    function returnID() public view returns(bool status_, address deeID_) {
        if (directory[msg.sender] == address(0)) {
            return (false, address(0));
        } else {
            return (true, directory[msg.sender]);
        }
    }
}