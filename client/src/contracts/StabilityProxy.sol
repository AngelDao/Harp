// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Interfaces/IStabilityPool.sol";
import "./StabilityFactory.sol";

contract StabilityProxy {
    using SafeMath for uint256;

    uint256 public lusdBalance;
    address public frontEnd;
    address public owner;
    IERC20 public lusdToken;
    IERC20 public lqtyToken;
    IStabilityPool public stabilityPool;
    StabilityFactory public stabilityFactory;

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can call this method");
        _;
    }

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    constructor(
        address _owner,
        StabilityFactory _factory,
        address _frontEnd,
        IERC20 _lusdToken,
        IStabilityPool _stabilityPool
    ) {
        owner = _owner;
        lusdToken = _lusdToken;
        stabilityPool = _stabilityPool;
        frontEnd = _frontEnd;
        stabilityFactory = _factory;
    }

    function deposit(uint256 _amount) public onlyOwner {
        _updateBalance();
        lusdToken.transferFrom(msg.sender, address(this), _amount);
        stabilityFactory.addLUSD(_amount);
        lusdBalance = lusdBalance.add(_amount);
        stabilityPool.provideToSP(_amount, frontEnd);
        stabilityFactory.updateProxyBalance(lusdBalance, owner);
        emit Deposit(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) public onlyOwner {
        _updateBalance();
        require(
            _amount <= lusdBalance,
            "Withdraw is for more than balance amount"
        );
        stabilityPool.withdrawFromSP(_amount);
        _safeLUSDTransfer(owner, _amount);
        stabilityFactory.updateProxyBalance(lusdBalance, owner);
        emit Withdraw(msg.sender, _amount);
    }

    function claim() public onlyOwner {
        _updateBalance();
        stabilityPool.withdrawFromSP(0);
        _safeETHTransferAll(owner);
        _safeLQTYTransferAll(owner);
    }

    function _safeLUSDTransfer(address _to, uint256 _amount) internal {
        uint256 lusdBal = lusdToken.balanceOf(address(this));
        if (_amount > lusdBal) {
            lusdToken.transfer(_to, lusdBal);
            lusdBalance = lusdBalance.sub(lusdBal);
            stabilityFactory.subtractLUSD(lusdBal);
        } else {
            lusdToken.transfer(_to, _amount);
            lusdBalance = lusdBalance.sub(_amount);
            stabilityFactory.subtractLUSD(_amount);
        }
    }

    function _safeETHTransferAll(address _to) internal {
        uint256 ethBal = address(this).balance;
        if (ethBal > 0) {
            payable(_to).transfer(ethBal);
        }
    }

    function _safeLQTYTransferAll(address _to) internal {
        uint256 lqtyBal = lqtyToken.balanceOf(address(this));
        if (lqtyBal > 0) {
            lqtyToken.transfer(_to, lqtyBal);
        }
    }

    function _updateBalance() internal {
        uint256 currentBal =
            stabilityPool.getCompoundedLUSDDeposit(address(this));
        if (currentBal > 0) {
            uint256 diff = lusdBalance.sub(currentBal);
            if (diff > 0) {
                stabilityFactory.subtractLUSD(diff);
                stabilityFactory.updateProxyBalance(currentBal, owner);
            }
            stabilityFactory.claim(owner);
        }
        lusdBalance = currentBal;
    }
}
