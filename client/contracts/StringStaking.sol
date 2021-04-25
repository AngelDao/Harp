// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "./StringToken.sol";
import "./Interfaces/ILQTYToken.sol";
import "./gStringToken.sol";
import "./Interfaces/IStabilityPool.sol";

contract StringStaking is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount; // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        uint256 lqtyRewardDebt;
        //
        // We do some fancy math here. Basically, any point in time, the amount of STRING
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accstringPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accStringPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken; // Address of LP token contract.
        uint256 lpTokenSupply;
        uint256 lastRewardBlock; // Last block number that STRING distribution occurs.
        uint256 accStringPerShare; // Accumulated STRING per share, times 1e12. See below.
        uint256 accLQTYPerShare;
    }

    // The STRING TOKEN!
    StringToken public stringToken;
    ILQTYToken public lqtyToken;
    gStringToken public gstringToken;
    IStabilityPool public stabilityPool;
    // Dev address.
    address public devaddr;
    bool public registered = false;
    address public creator;
    // Block number when bonus STRING period ends.
    uint256 public endBlock;
    // STRING tokens created per block.
    uint256 public stringPerBlock = 230769230800000000;
    uint256 public postBoostedBlock;
    uint256 public constant boostedMultiplier = 5;
    bool public isBoosted = true;
    uint256 public lastLQTYRewards = 0;
    uint256 public totalLQTYRewards = 0;

    // Info of each pool.
    PoolInfo public pool;
    // Info of each user that stakes LP tokens.
    mapping(address => UserInfo) public userInfo;
    // Total allocation poitns. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;
    // The block number when STRING mining starts.
    uint256 public startBlock;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Claim(
        address indexed who,
        uint256 amountClaimed,
        uint256 seconAmountClaimed
    );
    event EmergencyWithdraw(address indexed user, uint256 amount);

    modifier onlyCreator() {
        require(msg.sender == creator, "only creator can call this method");
        _;
    }

    constructor(
        StringToken _string,
        uint256 _boostedBuffer,
        ILQTYToken _lqty,
        gStringToken _gstringToken,
        IStabilityPool _stabilityPool
    ) public {
        stringToken = _string;
        lqtyToken = _lqty;
        gstringToken = _gstringToken;
        endBlock = block.number.add(2437500);
        startBlock = block.number;
        postBoostedBlock = block.number.add(_boostedBuffer);
        stabilityPool = _stabilityPool;
        creator = msg.sender;
        pool = PoolInfo({
            lpToken: stringToken,
            lpTokenSupply: 0,
            lastRewardBlock: block.number,
            accStringPerShare: 0,
            accLQTYPerShare: 0
        });
    }

    function registerIt() public {
        require(registered == false, "Already registered");
        stabilityPool.registerFrontEnd(9e17);
        registered = true;
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to)
        public
        view
        returns (uint256)
    {
        if (_to <= endBlock) {
            return _to.sub(_from);
        } else if (_from >= endBlock) {
            return 0;
        } else {
            return endBlock.sub(_from);
        }
    }

    // View function to see pending STRING on frontend.
    function pendingString(address _user) external view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        uint256 accStringPerShare = pool.accStringPerShare;
        uint256 lpSupply = pool.lpTokenSupply;
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier =
                getMultiplier(pool.lastRewardBlock, block.number);
            uint256 stringReward = multiplier.mul(stringPerBlock);
            accStringPerShare = accStringPerShare.add(
                stringReward.mul(1e12).div(lpSupply)
            );
        }
        uint256 pending =
            user.amount.mul(accStringPerShare).div(1e12).sub(user.rewardDebt);

        if (isBoosted) {
            return pending.mul(boostedMultiplier);
        } else {
            return pending;
        }
    }

    // View function to see pending LQTY on frontend.
    function pendingLQTY(address _user) external view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        uint256 accLQTYPerShare = pool.accLQTYPerShare;
        uint256 lpSupply = pool.lpTokenSupply;

        uint256 lqtyAvailableRewards = lqtyToken.balanceOf(address(this));
        uint256 freshRewards = 0;

        if (lqtyAvailableRewards > lastLQTYRewards) {
            freshRewards = lqtyAvailableRewards.sub(lastLQTYRewards);
        }

        if (freshRewards > 0) {
            accLQTYPerShare = pool.accLQTYPerShare.add(
                freshRewards.mul(1e12).div(lpSupply)
            );
        }

        uint256 pending =
            user.amount.mul(accLQTYPerShare).div(1e12).sub(user.lqtyRewardDebt);
        return pending;
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool() public {
        _updateSP();
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.lpTokenSupply;
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        uint256 stringReward = multiplier.mul(stringPerBlock);
        if (block.number < postBoostedBlock) {
            uint256 boostedReward = stringReward.mul(boostedMultiplier);
            stringToken.mintTo(address(this), boostedReward);
        } else {
            if (isBoosted) {
                isBoosted = false;
            }
            stringToken.mintTo(address(this), stringReward);
        }

        pool.accStringPerShare = pool.accStringPerShare.add(
            stringReward.mul(1e12).div(lpSupply)
        );

        pool.lastRewardBlock = block.number;
    }

    function _updateSP() internal {
        uint256 lpSupply = pool.lpTokenSupply;

        if (lpSupply == 0) {
            return;
        }

        uint256 lqtyAvailableRewards = lqtyToken.balanceOf(address(this));
        uint256 freshRewards = 0;

        if (lqtyAvailableRewards > lastLQTYRewards) {
            freshRewards = lqtyAvailableRewards.sub(lastLQTYRewards);
        }

        if (freshRewards > 0) {
            pool.accLQTYPerShare = pool.accLQTYPerShare.add(
                freshRewards.mul(1e12).div(lpSupply)
            );
        }
        lastLQTYRewards = lqtyAvailableRewards;
    }

    // Deposit LP tokens for STRING allocation.
    function deposit(uint256 _amount) public {
        UserInfo storage user = userInfo[msg.sender];
        updatePool();
        if (user.amount > 0) {
            uint256 pending = _pending(user);
            uint256 pendingLQTY = _pendingLQTY(user);
            safeStringTransfer(msg.sender, pending);
            safeLQTYTransfer(msg.sender, pendingLQTY);
        }
        pool.lpToken.safeTransferFrom(
            address(msg.sender),
            address(this),
            _amount
        );

        user.amount = user.amount.add(_amount);
        pool.lpTokenSupply = pool.lpTokenSupply.add(_amount);

        user.rewardDebt = user.amount.mul(pool.accStringPerShare).div(1e12);
        user.lqtyRewardDebt = user.amount.mul(pool.accLQTYPerShare).div(1e12);
        gstringToken.mintTo(msg.sender, _amount);
        emit Deposit(msg.sender, _amount);
    }

    // Withdraw LP tokens.
    function withdraw(uint256 _amount) public {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount >= _amount, "withdraw: not good");
        uint256 cNotes = gstringToken.balanceOf(msg.sender);
        require(_amount <= cNotes, "not enough gSTRING");
        updatePool();
        uint256 pending = _pending(user);
        uint256 pendingLQTY = _pendingLQTY(user);
        safeStringTransfer(msg.sender, pending);
        safeLQTYTransfer(msg.sender, pendingLQTY);
        user.amount = user.amount.sub(_amount);
        pool.lpTokenSupply = pool.lpTokenSupply.sub(_amount);
        gstringToken.burnFrom(msg.sender, _amount);
        pool.lpToken.safeTransfer(address(msg.sender), _amount);
        user.rewardDebt = user.amount.mul(pool.accStringPerShare).div(1e12);
        user.lqtyRewardDebt = user.amount.mul(pool.accLQTYPerShare).div(1e12);
        emit Withdraw(msg.sender, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw() public {
        UserInfo storage user = userInfo[msg.sender];
        pool.lpToken.safeTransfer(address(msg.sender), user.amount);
        emit EmergencyWithdraw(msg.sender, user.amount);
        user.amount = 0;
        user.rewardDebt = 0;
    }

    // Safe STRING transfer function, just in case if rounding error causes pool to not have enough STRING.
    function safeStringTransfer(address _to, uint256 _amount) internal {
        uint256 totalString = stringToken.balanceOf(address(this));
        uint256 rewardsBal = totalString.sub(pool.lpTokenSupply);

        if (_amount > rewardsBal) {
            stringToken.transfer(_to, rewardsBal);
        } else {
            stringToken.transfer(_to, _amount);
        }
    }

    function safeLQTYTransfer(address _to, uint256 _amount) internal {
        uint256 lqtyBal = lqtyToken.balanceOf(address(this));
        if (_amount > lqtyBal) {
            lqtyToken.transfer(_to, lqtyBal);
            lastLQTYRewards = lastLQTYRewards.sub(lqtyBal);
        } else {
            lqtyToken.transfer(_to, _amount);
            lastLQTYRewards = lastLQTYRewards.sub(_amount);
        }
    }

    function _pending(UserInfo storage _user) internal view returns (uint256) {
        uint256 totalString = stringToken.balanceOf(address(this));
        uint256 rewardsBal = totalString.sub(pool.lpTokenSupply);

        uint256 rewardsToSend =
            _user.amount.mul(pool.accStringPerShare).div(1e12).sub(
                _user.rewardDebt
            );
        if (isBoosted) {
            return rewardsToSend.mul(boostedMultiplier);
        }
        return rewardsToSend;
    }

    function _pendingLQTY(UserInfo storage _user)
        internal
        view
        returns (uint256)
    {
        uint256 lqtyRewardsToSend =
            _user.amount.mul(pool.accLQTYPerShare).div(1e12).sub(
                _user.lqtyRewardDebt
            );
        return lqtyRewardsToSend;
    }
}
