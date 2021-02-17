pragma solidity >=0.6.0 <0.8.0;

import "@optionality.io/clone-factory/contracts/CloneFactory.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./StabilityProxy.sol";

contract StabilityFactory is CloneFactory {
    using SafeMath for uint256;

    struct PoolInfo {
        uint256 lastRewardBlock; // Last block number that SUSHIs distribution occurs.
        uint256 accStringPerShare; // Accumulated SUSHIs per share, times 1e12. See below.
    }

    struct UserProxy {
        address proxyAddress;
        uint256 amount;
        uint256 rewardDebt;
    }

    address public impli;
    address public frontEnd;
    mapping(address => UserProxy) public userProxys;
    mapping(address => bool) public registeredClone;
    uint256 public totalLUSD;
    PoolInfo public pool;
    StringToken public stringToken;
    IERC20 public lusdToken;
    uint256 public stringPerBlock = 1435897436000000000;
    uint256 public postBoostedBlock;
    uint256 public constant boostedMultiplier = 5;
    bool public isBoosted = true;

    modifier isRegClone() {
        require(
            registeredClone[msg.sender] == true,
            "only owner can call this method"
        );
        _;
    }

    constructor(
        address _frontEnd,
        address _impli,
        IERC20 _lusdToken,
        StringToken _stringToken
    ) {
        frontEnd = _frontEnd;
        impli = _impli;
        pool = PoolInfo({lastRewardBlock: block.number, accStringPerShare: 0});
        stringToken = _stringToken;
        lusdToken = _lusdToken;
    }

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

    function updateProxyBalance(uint256 _amount) public isRegClone {
        userProxys[msg.sender].amount = _amount;
    }

    function update() public {
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = totalLUSD;
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

    function claim(address _sender) public {
        StabilityProxy storage proxy = userProxys[_sender];
        uint256 pending = _pending(proxy.amount, proxy.rewardDebt);
        _safeStringTransfer(_sender, pending);
        proxy.rewardDebt = proxy.amount.mul(pool.accStringPerShare).div(1e12);
    }

    function addLUSD(uint256 _newAddition) public isRegClone {
        totalLUSD = totalLUSD.add(_newAddition);
        update();
    }

    function subtractLUSD(uint256 _newSubtract) public isRegClone {
        totalLUSD = totalLUSD.sub(_newSubtract);
        update();
    }

    function createStabilityProxy(uint256 _deposit) public {
        address clone = createClone(impli);
        StabilityProxy(clone).init(
            msg.sender,
            address(this),
            _deposit,
            frontEnd
        );
        UserProxy proxy =
            UserProxy({proxyAddress: clone, amount: 0, rewardDebt: 0});
        userProxys[msg.sender] = proxy;
        registeredClone[clone] = true;
    }

    function _pending(uint256 _amount, uint256 _rewardDebt)
        internal
        view
        returns (uint256)
    {
        uint256 rewardsToSend =
            _amount.mul(pool.accStringPerShare).div(1e12).sub(_rewardDebt);
        if (isBoosted) {
            return rewardsToSend.mul(boostedMultiplier);
        }
        return rewardsToSend;
    }

    function _safeStringTransfer(address _to, uint256 _amount) internal {
        uint256 stringBal = stringToken.balanceOf(address(this));
        if (_amount > stringBal) {
            stringToken.transfer(_to, stringBal);
        } else {
            stringToken.transfer(_to, _amount);
        }
    }
}
