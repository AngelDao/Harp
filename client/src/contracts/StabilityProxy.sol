// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./StabilityPool.sol";
import "./StabilityFactory.sol";

contract StabilityProxy {
    using SafeMath for uint256;

    uint256 public lusdBalance;
    address public creator;
    address public frontEnd;
    address public owner;
    IERC20 public lusdToken;
    StabilityPool public stabilityPool;
    StabilityFactory public stabilityFactory;

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can call this method");
        _;
    }

    constructor(
        address _owner,
        address _factory,
        address _frontEnd,
        IERC20 _lusdToken,
        StabilityPool _stabilityPool
    ) {
        owner = _owner;
        creator = _creator;
        lusdToken = _lusdToken;
        stabilityPool = _stabilityPool;
        frontEnd = _frontEnd;
        stabilityFactory = _factory;
    }

    function deposit(uint256 _amount) public onlyOwner {
        _updateBalance();
        lusdToken.transferFrom(msg.sender, address(this), _amount);
        lusdBalance = lusdBalance.add(_amount);
        stabilityPool.provideToSP(_amount, frontEnd);
    }

    function withdraw(uint256 _amount) public onlyOwner {
        _updateBalance();
        require(
            _amount <= lusdBalance,
            "Withdraw is for more than balance amount"
        );
        stabilityPool.withdrawFromSP(_amount);
        _safeLUSDTransfer(owner, _amount);
    }

    function claim() public onlyOwner {
        stabilityPool.withdrawFromSP(0);
    }

    function _safeLUSDTransfer(address _to, uint256 _amount) internal {
        uint256 lusdBal = lusdToken.balanceOf(address(this));
        if (_amount > lusdBal) {
            lusdToken.transfer(_to, lusdBal);
            lusdBalance = lusdBalance.sub(lusdBal);
        } else {
            lusdToken.transfer(_to, _amount);
            lusdBalance = lusdBalance.sub(_amount);
        }
    }

    function _safeETHTransfer(address _to, uint256 _amount) internal {
        uint256 lusdBal = lusdToken.balanceOf(address(this));
        if (_amount > lusdBal) {
            lusdToken.transfer(_to, lusdBal);
            lusdBalance = lusdBalance.sub(lusdBal);
        } else {
            lusdToken.transfer(_to, _amount);
            lusdBalance = lusdBalance.sub(_amount);
        }
    }

    function _safeLQTYTransfer(address _to, uint256 _amount) internal {
        uint256 lusdBal = lusdToken.balanceOf(address(this));
        if (_amount > lusdBal) {
            lusdToken.transfer(_to, lusdBal);
            lusdBalance = lusdBalance.sub(lusdBal);
        } else {
            lusdToken.transfer(_to, _amount);
            lusdBalance = lusdBalance.sub(_amount);
        }
    }

    function _updateBalance() internal {
        uint256 currentBal =
            stabilityPool.getCompoundedLUSDDeposit(address(this));
        if (currentBal > 0) {
            uint256 diff = lusdBalance.sub(currentBal);
            if (diff > 0) {
                stabilityFactory.subtractLUSD(diff);
                stabilityFactory.updateProxyBalance(currentBal);
                stabilityFactory.claim();
            }
        }
        lusdBalance = currentBal;
    }
}
