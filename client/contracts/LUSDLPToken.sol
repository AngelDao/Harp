pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LUSDLPToken is ERC20 {
    constructor(address _owner) ERC20("LUSD LP Token", "UNI-LP") {
        _mint(_owner, 1000);
    }
}
