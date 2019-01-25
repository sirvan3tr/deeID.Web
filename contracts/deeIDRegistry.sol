pragma solidity ^0.5.0;

contract deeIDRegistry {
    
    struct Link {
        string link;
        string title;
        address creator;
        string status; // not in use, garbage etc...
    }

    struct Links {
        uint[] linkList; // list of keys so we can lookup a link
        mapping (uint => Link) linkStruct;
    }
    
    mapping (address => Links) linksStruct;
    address[] userAddressList;


    mapping (address => Link) theLinks;

/*
    function createLink(address _address, string memory _URL, string memory _title) public {
        var link = theLinks[_address];
        
        link.link = _URL;
        link.creator = msg.sender;
        link.title = _title;
        
        //instructorAccts.push(_address) -1;
    }
*/

    function newLink(string memory _url, string memory _title, address _deeID) public {
        uint256 newID = linksStruct[_deeID].linkList.length + 1;
        linksStruct[_deeID].linkList.push(newID);
        linksStruct[_deeID].linkStruct[newID].link = _url;
        linksStruct[_deeID].linkStruct[newID].title = _title;
        linksStruct[_deeID].linkStruct[newID].creator = msg.sender;
    }

    // return link and title
    function getALink(address _deeID, uint _linkID) view public returns (string memory, string memory) {
        return (linksStruct[_deeID].linkStruct[_linkID].link,
            linksStruct[_deeID].linkStruct[_linkID].title);
    }

    function getLink(address _address) view public returns (string memory, address address_, string memory) {
        return (theLinks[_address].link, theLinks[_address].creator, theLinks[_address].title);
    }
}