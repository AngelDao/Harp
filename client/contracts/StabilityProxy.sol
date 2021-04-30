// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

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
        IERC20 _lqtyToken,
        IStabilityPool _stabilityPool
    ) public {
        owner = _owner;
        lusdToken = _lusdToken;
        lqtyToken = _lqtyToken;
        stabilityPool = _stabilityPool;
        frontEnd = _frontEnd;
        stabilityFactory = _factory;
    }

    function deposit(uint256 _amount) public onlyOwner {
        stabilityFactory.update();
        if (lusdBalance > 0) {
            _updateBalance();
        }
        lusdToken.transferFrom(msg.sender, address(this), _amount);
        stabilityFactory.addLUSD(_amount);
        lusdBalance = lusdBalance.add(_amount);
        stabilityFactory.updateProxyBalance(lusdBalance, owner);
        stabilityPool.provideToSP(_amount, frontEnd);
        emit Deposit(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) public onlyOwner {
        require(
            _amount <= lusdBalance,
            "Withdraw is for more than balance amount"
        );
        stabilityFactory.update();
        _updateBalance();
        if (_amount > lusdBalance) {
            stabilityPool.withdrawFromSP(lusdBalance);
            _safeLUSDTransfer(owner, lusdBalance);
        } else {
            stabilityPool.withdrawFromSP(_amount);
            _safeLUSDTransfer(owner, _amount);
        }
        stabilityFactory.updateProxyBalance(lusdBalance, owner);
        emit Withdraw(msg.sender, _amount);
    }

    function claim() public onlyOwner {
        stabilityFactory.update();
        _updateBalance();
        stabilityPool.withdrawFromSP(0);
        _safeLQTYTransferAll(owner);
    }

    function emergencyWithdraw() public onlyOwner {
        uint256 currentBal =
            stabilityPool.getCompoundedLUSDDeposit(address(this));
        stabilityPool.withdrawFromSP(currentBal);
        stabilityFactory.updateProxyBalanceEmergency(owner);
        _safeLUSDTransfer(owner, currentBal);
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

    fallback() external payable {
        _safeETHTransferAll(owner);
    }

    receive() external payable {
        _safeETHTransferAll(owner);
    }
}
