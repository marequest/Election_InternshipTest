pragma solidity ^0.8.0;

import "./ERC721.sol";

contract Color is ERC721 {
    string[] public colors;
    mapping(string => bool) _colorExists;

    constructor() ERC721("Color", "COLOR") public {
    }

    function mint(string memory _color) public {//Valjalo bi da bude restricted na admina npr
        // Require unique color
        require(!_colorExists[_color]);

        colors.push(_color);
        uint _id = colors.length;
        _mint(msg.sender, _id);
        _colorExists[_color] = true;
    }
}