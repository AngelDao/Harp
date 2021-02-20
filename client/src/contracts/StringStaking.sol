// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "./StringToken.sol";
// import "./ILQTYToken.sol";
import "./Interfaces/ILQTYToken.sol";
import "./gStringToken.sol";

contract StringStaking is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount; // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        uint256 lqtyRewardDebt;
        //
        // We do some fancy math here. Basically, any point in time, the amount of SUSHIs
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
        uint256 lastRewardBlock; // Last block number that SUSHIs distribution occurs.
        uint256 accStringPerShare; // Accumulated SUSHIs per share, times 1e12. See below.
        uint256 accLQTYPerShare;
    }

    // The SUSHI TOKEN!
    StringToken public stringToken;
    ILQTYToken public lqtyToken;
    gStringToken public gstringToken;
    // Dev address.
    address public devaddr;
    // Block number when bonus SUSHI period ends.
    uint256 public endBlock;
    // SUSHI tokens created per block.
    uint256 public stringPerBlock = 1435897436000000000;
    uint256 public postBoostedBlock;
    uint256 public constant boostedMultiplier = 5;
    bool public isBoosted = true;

    // Info of each pool.
    PoolInfo public pool;
    // Info of each user that stakes LP tokens.
    mapping(address => UserInfo) public userInfo;
    // Total allocation poitns. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;
    // The block number when SUSHI mining starts.
    uint256 public startBlock;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    constructor(
        StringToken _string,
        uint256 _boostedBuffer,
        ILQTYToken _lqty,
        gStringToken _gstringToken
    ) {
        stringToken = _string;
        lqtyToken = _lqty;
        gstringToken = _gstringToken;
        endBlock = block.number.add(2437500);
        startBlock = block.number;
        postBoostedBlock = block.number.add(_boostedBuffer);

        pool = PoolInfo({
            lpToken: stringToken,
            lpTokenSupply: 0,
            lastRewardBlock: block.number,
            accStringPerShare: 0,
            accLQTYPerShare: 0
        });
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

    // View function to see pending SUSHIs on frontend.
    function pendingString(address _user) external view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        uint256 accStringPerShare = pool.accStringPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
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

    // Update reward variables of the given pool to be up-to-date.
    function updatePool() public {
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

    function updateSP() public {
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.lpTokenSupply;

        if (lpSupply == 0) {
            return;
        }

        uint256 lqtyAvailableRewards = lqtyToken.balanceOf(address(this));

        if (lqtyAvailableRewards > 0) {
            pool.accLQTYPerShare = pool.accLQTYPerShare.add(
                lqtyAvailableRewards.mul(1e12).div(lpSupply)
            );
        }
        pool.lastRewardBlock = block.number;
    }

    function updateForFee(uint256 _fee) internal {
        uint256 lpSupply = pool.lpTokenSupply;
        pool.accStringPerShare = pool.accStringPerShare.add(
            _fee.mul(1e12).div(lpSupply)
        );
    }

    // Deposit LP tokens to MasterChef for SUSHI allocation.
    function deposit(uint256 _amount) public {
        UserInfo storage user = userInfo[msg.sender];
        updatePool();
        updateSP();
        uint256 cNotes = gstringToken.balanceOf(msg.sender);
        if (user.amount > 0) {
            uint256 pending = _pending(user, cNotes);
            uint256 pendingLQTY = _pendingLQTY(user, cNotes);
            safeStringTransfer(msg.sender, pending);
            safeLQTYTransfer(msg.sender, pendingLQTY);
        }
        pool.lpToken.safeTransferFrom(
            address(msg.sender),
            address(this),
            _amount
        );
        uint256 fee = _amount.div(1000);
        uint256 depositAmount = _amount.sub(fee);
        user.amount = user.amount.add(depositAmount);
        pool.lpTokenSupply = pool.lpTokenSupply.add(depositAmount);

        uint256 debtAmount;

        if (user.amount.sub(depositAmount) > cNotes) {
            debtAmount = user.amount.sub(depositAmount).add(cNotes);
        } else if (user.amount.sub(depositAmount) <= cNotes) {
            debtAmount = user.amount;
        }

        user.rewardDebt = debtAmount.mul(pool.accStringPerShare).div(1e12);
        user.lqtyRewardDebt = debtAmount.mul(pool.accLQTYPerShare).div(1e12);
        updateForFee(fee);
        gstringToken.mintTo(msg.sender, depositAmount);
        emit Deposit(msg.sender, _amount);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _amount) public {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount >= _amount, "withdraw: not good");
        updatePool();
        updateSP();
        uint256 cNotes = gstringToken.balanceOf(msg.sender);
        uint256 pending = _pending(user, cNotes);
        uint256 pendingLQTY = _pendingLQTY(user, cNotes);
        safeStringTransfer(msg.sender, pending);
        safeLQTYTransfer(msg.sender, pendingLQTY);

        uint256 redeemAmount;

        if (_amount > cNotes) {
            redeemAmount = cNotes;
        } else if (_amount <= cNotes) {
            redeemAmount = _amount;
        }

        user.amount = user.amount.sub(redeemAmount);
        gstringToken.burnFrom(msg.sender, redeemAmount);
        pool.lpToken.safeTransfer(address(msg.sender), redeemAmount);
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

    // Safe sushi transfer function, just in case if rounding error causes pool to not have enough SUSHIs.
    function safeStringTransfer(address _to, uint256 _amount) internal {
        uint256 stringBal = stringToken.balanceOf(address(this));
        if (_amount > stringBal) {
            stringToken.transfer(_to, stringBal);
        } else {
            stringToken.transfer(_to, _amount);
        }
    }

    function safeLQTYTransfer(address _to, uint256 _amount) internal {
        uint256 lqtyBal = lqtyToken.balanceOf(address(this));
        if (_amount > lqtyBal) {
            lqtyToken.transfer(_to, lqtyBal);
        } else {
            lqtyToken.transfer(_to, _amount);
        }
    }

    function _pending(UserInfo storage _user, uint256 _cNotes)
        internal
        view
        returns (uint256)
    {
        uint256 amount;

        if (_user.amount > _cNotes) {
            amount = _cNotes;
        } else if (_user.amount <= _cNotes) {
            amount = _user.amount;
        }
        uint256 rewardsToSend =
            amount.mul(pool.accStringPerShare).div(1e12).sub(_user.rewardDebt);
        if (isBoosted) {
            return rewardsToSend.mul(boostedMultiplier);
        }
        return rewardsToSend;
    }

    function _pendingLQTY(UserInfo storage _user, uint256 _cNotes)
        internal
        view
        returns (uint256)
    {
        uint256 amount;

        if (_user.amount > _cNotes) {
            amount = _cNotes;
        } else if (_user.amount <= _cNotes) {
            amount = _user.amount;
        }
        uint256 lqtyRewardsToSend =
            amount.mul(pool.accLQTYPerShare).div(1e12).sub(
                _user.lqtyRewardDebt
            );
        return lqtyRewardsToSend;
    }
}
