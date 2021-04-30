// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Interfaces/IStabilityPool.sol";
import "./StabilityFactory.sol";
import "./Test/ETHSendContract.sol";

import "hardhat/console.sol";

contract StabilityProxy {
    using SafeMath for uint256;

    uint256 public lusdBalance;
    address public frontEnd;
    address public owner;
    IERC20 public lusdToken;
    IERC20 public lqtyToken;
    IStabilityPool public stabilityPool;
    StabilityFactory public stabilityFactory;
    ETHSendContract public testContract;

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
        IStabilityPool _stabilityPool,
        ETHSendContract _test

    ) public {
        owner = _owner;
        lusdToken = _lusdToken;
        lqtyToken = _lqtyToken;
        stabilityPool = _stabilityPool;
        frontEnd = _frontEnd;
        stabilityFactory = _factory;
        testContract = _test;
    }

    function deposit(uint256 _amount) public onlyOwner {
        stabilityFactory.update();
        if (lusdBalance > 0) {
            _updateBalance(false);
        }
        lusdToken.transferFrom(msg.sender, address(this), _amount);
        stabilityFactory.addLUSD(_amount);
        lusdBalance = lusdBalance.add(_amount);
        stabilityPool.provideToSP(_amount, frontEnd);
        stabilityFactory.updateProxyBalance(lusdBalance, owner);
        emit Deposit(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) public onlyOwner {
        require(
            _amount <= lusdBalance,
            "Withdraw is for more than balance amount"
        );
        stabilityFactory.update();
        _updateBalance(false);
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

    function claim(bool _TESTadjust) public onlyOwner {
        stabilityFactory.update();
        _updateBalance(_TESTadjust);
        stabilityPool.withdrawFromSP(0);
        _safeLQTYTransferAll(owner);
    }

    function emergencyWithdraw() public onlyOwner {
        uint256 currentBal =
            stabilityPool.getCompoundedLUSDDeposit(address(this), false);
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
         address(_to).call{value:ethBal}("");
        }
    }

    function _safeLQTYTransferAll(address _to) internal {
        uint256 lqtyBal = lqtyToken.balanceOf(address(this));
        if (lqtyBal > 0) {
            lqtyToken.transfer(_to, lqtyBal);
        }
    }

    function _updateBalance(bool _TESTadjust) internal {
        uint256 currentBal =
            stabilityPool.getCompoundedLUSDDeposit(address(this), _TESTadjust);
           
        if (currentBal > 0) {
            console.log("currentBal SP", currentBal);
        console.log("lusdBalance", lusdBalance);
            uint256 diff = 0;
            
            if(lusdBalance >= currentBal){

            diff = lusdBalance.sub(currentBal);
            }

            stabilityFactory.claim(owner);
            if (diff > 0) {
                console.log("diff", diff);
                stabilityFactory.subtractLUSD(diff);
                stabilityFactory.updateProxyBalance(currentBal, owner);
            }
        }
        if(lusdBalance >= currentBal){

        lusdBalance = currentBal;
        }
    }

    fallback() external payable {
        console.log("fallback");
        _safeETHTransferAll(owner);
    }

    receive() external payable {
        console.log("receive");
        uint256 ethBal = address(this).balance;
        console.log("currentBal", ethBal);
        _safeETHTransferAll(owner);
    }

    function TESTclaim() external {
        testContract.getAllETH();
    }
}
