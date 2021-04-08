pragma solidity >=0.6.0 <0.8.0;

import "./IPriceFeed.sol";

interface ILiquityBase {
    function priceFeed() external view returns (IPriceFeed);
}
