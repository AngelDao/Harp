// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/upgrades/contracts/upgradeability/ProxyFactory.sol"

contract StabilityFactory is ProxyFactory {
    
    address public impli;
    

    constructor(address _impli){
        impli = _impli;
    }
    
    function cloneStore()public{

    }
}
