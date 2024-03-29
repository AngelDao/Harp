// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./StringToken.sol";

import "hardhat/console.sol";

contract Farm {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount; // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
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
        uint256 allocPoint; // How many allocation points assigned to this pool. STRING to distribute per block.
        uint256 lastRewardBlock; // Last block number that STRING distribution occurs.
        uint256 accStringPerShare; // Accumulated STRING per share, times 1e12. See below.
    }

    uint256 public lastSupply;
    uint256 public maxSupply;
    // The STRING TOKEN!
    StringToken public stringToken;
    // creator address.
    address public creator;
    // Block number when bonus STRING period ends.
    uint256 public endBlock;
    // STRING tokens created per block.
    uint256 public stringPerBlock = 641025641000000000;
    uint256 public postBoostedBlock;
    uint256 public constant boostedMultiplier = 5;
    bool public isBoosted = true;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    // Total allocation poitns. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;
    // The block number when STRING mining starts.
    uint256 public startBlock;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event Claim(address indexed who, uint256 amountClaimed);
    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );

    modifier onlyCreator() {
        require(msg.sender == creator, "only creator can call this method");
        _;
    }

    constructor(StringToken _string, uint256 _boostedBuffer) public {
        stringToken = _string;
        endBlock = block.number.add(2437500);
        startBlock = block.number;
        postBoostedBlock = block.number.add(_boostedBuffer);
        creator = msg.sender;
        lastSupply = stringToken.totalSupply();
        maxSupply = stringToken.maxSupply();
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new lp to the pool. Can only be called by the owner.
    // XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do.
    function addPool(
        uint256 _allocPoint,
        IERC20 _lpToken,
        bool _withUpdate
    ) external onlyCreator {
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock =
            block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(
            PoolInfo({
                lpToken: _lpToken,
                allocPoint: _allocPoint,
                lastRewardBlock: lastRewardBlock,
                accStringPerShare: 0
            })
        );
    }

    // Update the given pool's STRING allocation point. Can only be called by the owner.
    function set(
        uint256 _pid,
        uint256 _allocPoint,
        bool _withUpdate
    ) external onlyCreator {
        if (_withUpdate) {
            massUpdatePools();
        }
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(
            _allocPoint
        );
        poolInfo[_pid].allocPoint = _allocPoint;
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
    function pendingString(uint256 _pid, address _user)
        external
        view
        returns (uint256)
    {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accStringPerShare = pool.accStringPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier =
                getMultiplier(pool.lastRewardBlock, block.number);
            uint256 stringReward =
                multiplier.mul(stringPerBlock).mul(pool.allocPoint).div(
                    totalAllocPoint
                );
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

    // Update reward vairables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }

        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        uint256 stringReward =
            multiplier.mul(stringPerBlock).mul(pool.allocPoint).div(
                totalAllocPoint
            );

        console.log("supply check", lastSupply.add(stringReward) > maxSupply);
        console.log("stringRewards", stringReward);
        if (lastSupply.add(stringReward) > maxSupply) {
            stringReward = maxSupply.sub(lastSupply);
            console.log("stringRewards", stringReward);
        }
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

    // Deposit LP tokens to Farm for STRING allocation.
    function deposit(uint256 _pid, uint256 _amount) external {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        if (lastSupply < maxSupply) {
            updatePool(_pid);
        }
        _updateSupply();
        if (user.amount > 0) {
            uint256 pending = _pending(user, pool);
            _safeStringTransfer(msg.sender, pending);
        }
        pool.lpToken.safeTransferFrom(
            address(msg.sender),
            address(this),
            _amount
        );
        user.amount = user.amount.add(_amount);
        user.rewardDebt = user.amount.mul(pool.accStringPerShare).div(1e12);
        emit Deposit(msg.sender, _pid, _amount);
    }

    // Withdraw LP tokens from Farm.
    function withdraw(uint256 _pid, uint256 _amount) external {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "withdraw: not good");
        if (lastSupply < maxSupply) {
            updatePool(_pid);
        }
        _updateSupply();
        uint256 pending = _pending(user, pool);
        _safeStringTransfer(msg.sender, pending);
        user.amount = user.amount.sub(_amount);
        user.rewardDebt = user.amount.mul(pool.accStringPerShare).div(1e12);
        pool.lpToken.safeTransfer(address(msg.sender), _amount);
        emit Withdraw(msg.sender, _pid, _amount);
    }

    function claim(uint256 _pid) external {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        if (lastSupply < maxSupply) {
            updatePool(_pid);
        }
        _updateSupply();
        uint256 pending = _pending(user, pool);
        _safeStringTransfer(msg.sender, pending);
        user.rewardDebt = user.amount.mul(pool.accStringPerShare).div(1e12);
        emit Claim(msg.sender, pending);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) external {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        pool.lpToken.safeTransfer(address(msg.sender), user.amount);
        emit EmergencyWithdraw(msg.sender, _pid, user.amount);
        user.amount = 0;
        user.rewardDebt = 0;
    }

    // Safe STRING transfer function, just in case if rounding error causes pool to not have enough STRING.
    function _safeStringTransfer(address _to, uint256 _amount) internal {
        uint256 stringBal = stringToken.balanceOf(address(this));
        if (_amount > stringBal) {
            stringToken.transfer(_to, stringBal);
        } else {
            stringToken.transfer(_to, _amount);
        }
    }

    function _pending(UserInfo storage _user, PoolInfo storage _pool)
        internal
        view
        returns (uint256)
    {
        uint256 rewardsToSend =
            _user.amount.mul(_pool.accStringPerShare).div(1e12).sub(
                _user.rewardDebt
            );
        if (isBoosted) {
            return rewardsToSend.mul(boostedMultiplier);
        }
        return rewardsToSend;
    }

    function _updateSupply() internal {
        lastSupply = stringToken.totalSupply();
    }
}
