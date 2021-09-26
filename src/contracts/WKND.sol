pragma solidity >= 0.6.0 <= 0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract WKND is ERC20Burnable{

    constructor() ERC20("Wakanda Token", "WKND"){

    }

    function decimals() public view override returns (uint8){
        return 0;
    }

    function burn(uint256 amount) public override{
        _burn(msg.sender, amount);
    }

    function mint(address _recipient, uint _amount) public {
        _mint(_recipient, _amount);
    }
}
