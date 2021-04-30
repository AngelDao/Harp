// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;


contract ETHSendContract {
    constructor()
        public
    {}

    fallback() external payable {}

    receive() external payable {}

    function getAllETH() external  {
        uint bal = address(this).balance;
        msg.sender.call{value:bal}("");
    }

   
}
