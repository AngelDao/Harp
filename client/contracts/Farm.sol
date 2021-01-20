// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./StringToken.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Farm {
    using SafeMath for uint256;
    // LP Token

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event Claim(address indexed who, uint256 amountClaimed);

    uint256 constant PRECISIONMul = 1e30;
    uint256 constant PRECISIONDiv = 1e10;
    uint256 constant PRECISIONDenominator = 1e20;

    struct User {
        uint256 balance;
        uint256 claimed;
        uint256 lastClaimedBlock;
    }

    struct Pool {
        bool isBoosted;
        bool isRewarding;
        uint256 maxRewardsToGive;
        uint256 currentRewardsGiven;
        uint256 amountStaked;
        uint256 rewardPerBlock;
        IERC20 lpToken;
    }

    // poolAccounts
    mapping(uint256 => mapping(address => User)) public poolUsers;

    // pool array
    Pool[] public pools;

    // Reward Token
    StringToken public stringToken;
    // Reward Token Per Block
    uint256 public rewardPerBlock;
    bool public isStarted = false;
    uint256 public startBlock;
    // 5.6mil * 10e18
    uint256 public farmAllocation = 5600000000000000000000000;
    // 4.48 mil * 10e18
    uint256 public ethAllocation = 4480000000000000000000000;
    // 1.12 mil * 10e18
    uint256 public lusdAllocation = 1120000000000000000000000;
    uint256 public farmTokensClaimed = 0;
    uint256 public boostedMultiplier = 5;
    uint256 public boostedDivisor = 2;

    // block reward ratios
    // 8/10
    uint256 public ETHPoolNumerator = 8;
    uint256 public ETHPoolDenominator = 10;
    // 2/10
    uint256 public LUSDPoolNumerator = 2;
    uint256 public LUSDPoolDenominator = 10;

    // pool token addresses
    IERC20 public ethLpToken;
    IERC20 public lusdLpToken;

    constructor(
        IERC20 _ETHlpToken,
        IERC20 _LUSDlpToken,
        StringToken _token,
        uint256 _rewardPerBlock
    ) {
        ethLpToken = _ETHlpToken;
        lusdLpToken = _LUSDlpToken;
        stringToken = _token;
        rewardPerBlock = _rewardPerBlock.mul(1e9);
    }

    // deposit
    function deposit(uint256 _amount, uint256 _pid) public {
        Pool storage pool = pools[_pid];
        User storage user = poolUsers[_pid][msg.sender];

        pool.lpToken.transferFrom(msg.sender, address(this), _amount);
        // First entrance into system
        claim(_pid);
        user.balance = user.balance.add(_amount);
        pool.amountStaked = pool.amountStaked.add(_amount);
    }

    // withdraw
    function withdraw(uint256 _pid, uint256 _amount) public {
        Pool storage pool = pools[_pid];
        User storage user = poolUsers[_pid][msg.sender];
        require(
            _amount <= user.balance,
            "Withdraw amount greater than the available balance"
        );
        pool.lpToken.transfer(msg.sender, _amount);
        claim(_pid);
        pool.amountStaked = pool.amountStaked.sub(_amount);
        user.balance = user.balance.sub(_amount);
    }

    // claim
    function claim(uint256 _pid) public {
        require(
            farmTokensClaimed < farmAllocation,
            "The Farm allocation has completed."
        );
        Pool storage pool = pools[_pid];
        User storage user = poolUsers[_pid][msg.sender];

        uint256 userClaimable;

        if (pool.isBoosted) {
            uint256 boostedCap = pool.maxRewardsToGive.div(boostedDivisor);
            if (pool.currentRewardsGiven < boostedCap) {
                userClaimable = _getPendingRewards(_pid).mul(boostedMultiplier);
            } else {
                pool.isBoosted = false;
                userClaimable = _getPendingRewards(_pid);
            }
        } else {
            userClaimable = _getPendingRewards(_pid);
        }

        // require(userClaimable > 0, "No tokens to claim");
        user.lastClaimedBlock = block.number;
        if (userClaimable > 0) {
            stringToken.mintTo(msg.sender, userClaimable);
            user.claimed = user.claimed.add(userClaimable);
            farmTokensClaimed = farmTokensClaimed.add(userClaimable);
            pool.currentRewardsGiven = pool.currentRewardsGiven.add(
                userClaimable
            );
        }
    }

    // Get Pending Rewards
    function _getPendingRewards(uint256 _pid) public view returns (uint256) {
        Pool memory pool = pools[_pid];
        User memory user = poolUsers[_pid][msg.sender];
        if (block.number > user.lastClaimedBlock && pool.amountStaked > 0) {
            uint256 newBlocks = block.number.sub(user.lastClaimedBlock);
            uint256 claimableTokens = newBlocks.mul(pool.rewardPerBlock);
            uint256 userPoolShareNumerator =
                user.balance.mul(PRECISIONMul).div(pool.amountStaked).div(
                    PRECISIONDiv
                );
            // dont think you need to subtract here
            // .sub(user.claimed);
            uint256 pendingRewards =
                claimableTokens.mul(userPoolShareNumerator).div(
                    PRECISIONDenominator
                );
            return pendingRewards;
        } else {
            return 0;
        }
    }

    function addInitialPools() public {
        require(!isStarted, "Initial pools already added.");
        startBlock = block.number;

        // Rewards Per Block Per Pool
        uint256 RPBEth =
            rewardPerBlock.mul(ETHPoolNumerator).div(ETHPoolDenominator);
        uint256 RPBLusd =
            rewardPerBlock.mul(LUSDPoolNumerator).div(LUSDPoolDenominator);

        _addPool(true, true, ethAllocation, 0, 0, RPBEth, ethLpToken);
        _addPool(true, true, lusdAllocation, 0, 0, RPBLusd, lusdLpToken);
        isStarted = true;
    }

    function _addPool(
        bool _isBoosted,
        bool _isRewarding,
        uint256 _maxRewardsToGive,
        uint256 _currentRewardsGiven,
        uint256 _amountStaked,
        uint256 _rewardPerBlock,
        IERC20 _lpToken
    ) internal {
        Pool memory _newPool =
            Pool({
                isBoosted: _isBoosted,
                isRewarding: _isRewarding,
                maxRewardsToGive: _maxRewardsToGive,
                currentRewardsGiven: _currentRewardsGiven,
                amountStaked: _amountStaked,
                rewardPerBlock: _rewardPerBlock,
                lpToken: _lpToken
            });
        pools.push(_newPool);
    }
}
