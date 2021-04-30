// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

import "./StringToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TokenVesting {
    // Distribution
    // 1mil * 10e18
    uint256 public AngelDAOAllocation = 1000000000000000000000000;
    uint256 public AngelDAOAllocationLeft = 1000000000000000000000000;
    bool public vestingComplete = false;
    bool public vestingStarted = false;
    uint256 public dailyVestingRate;
    uint256 public vestingPeriodDays;
    uint256 public startDistributionTime;
    uint256 public lastDistributionTime;
    address public AngelDAOAddress;
    StringToken public stringToken;
    using SafeMath for uint256;

    // Set address to be distributed to
    constructor(
        address _vestingAddress,
        uint256 _days,
        StringToken _stringToken
    ) public {
        AngelDAOAddress = _vestingAddress;
        vestingPeriodDays = _days;
        dailyVestingRate = AngelDAOAllocation.div(_days);
        stringToken = _stringToken;
    }

    // set start time of vesting
    function start() external {
        require(vestingStarted == false, "Vesting has already started");
        startDistributionTime = block.timestamp;
        lastDistributionTime = block.timestamp;
        vestingStarted = true;
    }

    function releasePending() external {
        require(
            !vestingComplete,
            "Vesting is complete no more tokens to be minted"
        );
        uint256 amount = _tokensToMint();
        if (amount < AngelDAOAllocationLeft) {
            stringToken.mintTo(AngelDAOAddress, amount);
            AngelDAOAllocationLeft = AngelDAOAllocationLeft.sub(amount);
        } else {
            stringToken.mintTo(AngelDAOAddress, AngelDAOAllocationLeft);
            AngelDAOAllocationLeft = 0;
            vestingComplete = true;
        }
    }

    function _tokensToMint() internal returns (uint256) {
        uint256 daysSince = block.timestamp.sub(lastDistributionTime);
        require(
            daysSince > 1 days,
            "at least one Days must pass for distribution"
        );
        uint256 fullDays = daysSince.div(60).div(60).div(24);
        uint256 buffer = fullDays * 1 days;
        lastDistributionTime = buffer.add(lastDistributionTime);
        uint256 tokens = fullDays.mul(dailyVestingRate);
        return tokens;
    }
}
