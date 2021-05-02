// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

abstract contract IPriceFeed {
    // --- Events ---
    event LastGoodPriceUpdated(uint256 _lastGoodPrice);

    constructor() public {}

    // The last good price seen from an oracle by Liquity
    uint256 public lastGoodPrice;

    // --- Function ---
    function fetchPrice() external virtual returns (uint256);
}
