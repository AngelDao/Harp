import StringToken from "../../abis/StringToken.json";
import Farm from "../../abis/LatestFarm.json";
import gStringToken from "../../abis/gStringToken.json";
import LQTYToken from "../../abis/ILQTYToken.json";
import LUSDToken from "../../abis/ILUSDToken.json";
import IERC20 from "../../abis/IERC20.json";
import ILQTYStaking from "../../abis/ILQTYStaking.json";
import StakingPool from "../../abis/StringStaking.json";
import StabilityFactory from "../../abis/StabilityFactory.json";
import StabilityProxy from "../../abis/StabilityProxy.json";
import IStabilityPool from "../../abis/IStabilityPool.json";
import { fromWei, toDecimal } from "../truncateString";
import { addresses } from "./addresses";

export const fetchgStringToken = async (networkId, web3, address) => {
  const gstringTokenNetwork = gStringToken.networks[networkId];
  //   ;
  if (gstringTokenNetwork) {
    const gstringToken = new web3.eth.Contract(
      gStringToken.abi,
      gstringTokenNetwork.address
    );
    const gSTRING = toDecimal(
      fromWei(web3, await gstringToken.methods.balanceOf(address).call())
    );

    return [gstringToken, gSTRING];
  }
};

export const fetchLUSDToken = async (networkId, web3, address) => {
  const LUSDTokenNetwork = LUSDToken.networks[networkId];
  if (networkId === 42) {
    const lusdToken = new web3.eth.Contract(
      LUSDToken.abi,
      addresses.kovan.lusdToken
    );
    const LUSD = toDecimal(
      fromWei(web3, await lusdToken.methods.balanceOf(address).call())
    );
    return [lusdToken, LUSD];
  } else if (LUSDTokenNetwork) {
    const lusdToken = new web3.eth.Contract(
      LUSDToken.abi,
      LUSDTokenNetwork.address
    );
    const LUSD = toDecimal(
      fromWei(web3, await lusdToken.methods.balanceOf(address).call())
    );
    return [lusdToken, LUSD];
  }
};

export const fetchLQTYToken = async (networkId, web3, address) => {
  const LQTYTokenNetwork = LQTYToken.networks[networkId];
  if (networkId === 42) {
    const lqtyToken = new web3.eth.Contract(
      LQTYToken.abi,
      addresses.kovan.lqtyToken
    );
    const LQTY = toDecimal(
      fromWei(web3, await lqtyToken.methods.balanceOf(address).call())
    );
    return [lqtyToken, LQTY];
  } else if (LQTYTokenNetwork) {
    const lqtyToken = new web3.eth.Contract(
      LQTYToken.abi,
      LQTYTokenNetwork.address
    );
    const LQTY = toDecimal(
      fromWei(web3, await lqtyToken.methods.balanceOf(address).call())
    );
    return [lqtyToken, LQTY];
  }
};

export const fetchStringToken = async (networkId, web3, address) => {
  const stringTokenNetwork = StringToken.networks[networkId];
  //   ;
  if (stringTokenNetwork) {
    const stringToken = new web3.eth.Contract(
      StringToken.abi,
      stringTokenNetwork.address
    );
    const STRING = toDecimal(
      fromWei(web3, await stringToken.methods.balanceOf(address).call())
    );
    return [stringToken, STRING];
  }
};

export const fetchETHLPTokens = async (networkId, web3, address) => {
  if (networkId === 42) {
    const ETHLPToken = new web3.eth.Contract(
      IERC20.abi,
      addresses.kovan.ethLPToken
    );

    const temp = fromWei(
      web3,
      await ETHLPToken.methods.balanceOf(address).call()
    );
    // const STRING_ETH_LP = 0;
    const STRING_ETH_LP = toDecimal(
      fromWei(web3, await ETHLPToken.methods.balanceOf(address).call())
    );
    return [ETHLPToken, STRING_ETH_LP];
  }
};

export const fetchLUSDLPTokens = async (networkId, web3, address) => {
  if (networkId === 42) {
    const LUSDLPToken = new web3.eth.Contract(
      IERC20.abi,
      addresses.kovan.lusdLPToken
    );
    const STRING_LUSD_LP = toDecimal(
      fromWei(web3, await LUSDLPToken.methods.balanceOf(address).call())
    );
    // const STRING_LUSD_LP = 0;

    return [LUSDLPToken, STRING_LUSD_LP];
  }
};

export const fetchProfitShare = async (
  networkId,
  web3,
  stringToken,
  gStringToken,
  address
) => {
  const psNetwork = StakingPool.networks[networkId];
  if (psNetwork) {
    const ps = new web3.eth.Contract(StakingPool.abi, psNetwork.address);
    // debugger;
    const allowancesSTRING = toDecimal(
      fromWei(
        web3,
        await stringToken.methods.allowance(address, ps._address).call()
      )
    );
    // debugger;

    const allowancesgSTRING = toDecimal(
      fromWei(
        web3,
        await gStringToken.methods.allowance(address, ps._address).call()
      )
    );
    // debugger;

    const isBoosted = await ps.methods.isBoosted().call();
    // debugger;
    const psSTRING = toDecimal(
      fromWei(web3, await stringToken.methods.balanceOf(ps._address).call())
    );
    // debugger;
    const pendingSTRING = toDecimal(
      fromWei(web3, await ps.methods.pendingString(address).call())
    );
    // debugger;

    // const ammount = (await ps.methods.userInfo(address).call()).amount;
    // const trnced = fromWei(web3, ammount);
    const userSTRINGStaked = toDecimal(
      fromWei(web3, (await ps.methods.userInfo(address).call()).amount)
    );
    // debugger;

    const psAllowances = {
      STRING: allowancesSTRING,
      gSTRING: allowancesgSTRING,
    };

    const psBalances = {
      isBoosted,
      userPending: {
        STRING: pendingSTRING,
      },
      userStaked: {
        STRING: userSTRINGStaked,
      },
      totalStaked: {
        STRING: psSTRING,
      },
    };

    return [ps, psAllowances, psBalances];
  }
};

export const fetchFarm = async (
  networkId,
  web3,
  ETHLPToken,
  LUSDLPToken,
  stringToken,
  address,
  lusdToken
) => {
  const farmNetwork = Farm.networks[networkId];
  if (farmNetwork) {
    const farm = new web3.eth.Contract(Farm.abi, farmNetwork.address);

    const farmSTRING_ETH_LP = toDecimal(
      fromWei(web3, await ETHLPToken.methods.balanceOf(farm._address).call())
    );
    const farmSTRING_LUSD_LP = toDecimal(
      fromWei(web3, await LUSDLPToken.methods.balanceOf(farm._address).call())
    );

    const userSTRING_ETH_LP = toDecimal(
      fromWei(web3, (await farm.methods.userInfo(0, address).call()).amount)
    );
    // ;
    // const pendingSTRING_ETH_LP = 0;
    const pendingSTRING_ETH_LP = toDecimal(
      fromWei(web3, await farm.methods.pendingString(0, address).call())
    );

    // const pendingSTRING_LUSD_LP = 0;
    const pendingSTRING_LUSD_LP = toDecimal(
      fromWei(web3, await farm.methods.pendingString(1, address).call())
    );

    // const userSTRING_LUSD_LP = 0;
    const userSTRING_LUSD_LP = toDecimal(
      fromWei(web3, (await farm.methods.userInfo(1, address).call()).amount)
    );

    const isBoosted = await farm.methods.isBoosted().call();

    const allowancesSTRING = toDecimal(
      fromWei(
        web3,
        await stringToken.methods.allowance(address, farm._address).call()
      )
    );
    const allowancesLUSD = toDecimal(
      fromWei(
        web3,
        await lusdToken.methods.allowance(address, farm._address).call()
      )
    );
    const allowancesSTRING_ETH_LP = toDecimal(
      fromWei(
        web3,
        await ETHLPToken.methods.allowance(address, farm._address).call()
      )
    );
    const allowancesSTRING_LUSD_LP = toDecimal(
      fromWei(
        web3,
        await LUSDLPToken.methods.allowance(address, farm._address).call()
      )
    );

    const allowances = {
      STRING: allowancesSTRING,
      gSTRING_ETH_LP: allowancesSTRING_ETH_LP,
      gSTRING_LUSD_LP: allowancesSTRING_LUSD_LP,
      LUSD: allowancesLUSD,
    };
    const farmBalances = {
      isBoosted,
      userPending: {
        gSTRING_ETH_LP: pendingSTRING_ETH_LP,
        gSTRING_LUSD_LP: pendingSTRING_LUSD_LP,
      },
      userStaked: {
        gSTRING_ETH_LP: userSTRING_ETH_LP,
        gSTRING_LUSD_LP: userSTRING_LUSD_LP,
      },
      totalStaked: {
        gSTRING_ETH_LP: farmSTRING_ETH_LP,
        gSTRING_LUSD_LP: farmSTRING_LUSD_LP,
      },
    };
    return [farm, allowances, farmBalances];
  }
};

export const fetchStabilityFactory = async (
  networkId,
  web3,
  address,
  lusdToken
) => {
  const SFNetwork = StabilityFactory.networks[networkId];

  if (SFNetwork) {
    // const sp = await
    const factory = new web3.eth.Contract(
      StabilityFactory.abi,
      SFNetwork.address
    );

    let userProxy = await factory.methods.userProxys(address).call();
    let stabilityPool;
    if (
      userProxy.proxyAddress === "0x0000000000000000000000000000000000000000"
    ) {
      userProxy = null;
    } else {
      userProxy = new web3.eth.Contract(
        StabilityProxy.abi,
        userProxy.proxyAddress
      );
      stabilityPool = new web3.eth.Contract(
        IStabilityPool.abi,
        addresses.kovan.stabilityPool
      );
    }
    const totalLUSD = toDecimal(
      fromWei(web3, await factory.methods.totalLUSD().call())
    );

    let allowanceLUSD, userStaked, pendingETH, pendingLQTY;
    if (userProxy) {
      allowanceLUSD = toDecimal(
        fromWei(
          web3,
          await lusdToken.methods.allowance(address, userProxy._address).call()
        )
      );
      let temp = await userProxy.methods.lusdBalance().call();
      userStaked = toDecimal(
        fromWei(web3, await userProxy.methods.lusdBalance().call())
      );

      pendingETH = fromWei(
        web3,
        await stabilityPool.methods
          .getDepositorETHGain(userProxy._address)
          .call()
      );

      pendingLQTY = fromWei(
        web3,
        await stabilityPool.methods
          .getDepositorLQTYGain(userProxy._address)
          .call()
      );
    } else {
      allowanceLUSD = 0;
      userStaked = 0;
    }

    const isBoosted = await factory.methods.isBoosted().call();
    const pendingSTRING = toDecimal(
      fromWei(web3, await factory.methods.pendingString(address).call())
    );

    const proxyAllowances = {
      LUSD: allowanceLUSD,
    };

    const proxyBalances = {
      userPending: {
        STRING: pendingSTRING,
        ETH: pendingETH && pendingETH,
        LQTY: pendingLQTY && pendingLQTY,
      },
      userStaked: {
        LUSD: userProxy ? userStaked : 0,
      },
    };

    const fyBalances = {
      isBoosted,
      totalStaked: {
        LUSD: totalLUSD,
      },
    };
    return [factory, userProxy, proxyAllowances, fyBalances, proxyBalances];
  }
};

export const fetchRewards = async (networkId, web3, address, lqtyToken) => {
  if (networkId === 42) {
    const rewards = new web3.eth.Contract(
      ILQTYStaking.abi,
      addresses.kovan.lqtyStaking
    );

    const lqtyStaked = toDecimal(
      fromWei(web3, await rewards.methods.stakes(address).call())
    );

    const pendingETH = toDecimal(
      fromWei(web3, await rewards.methods.getPendingETHGain(address).call())
    );

    debugger;

    const pendingLUSD = toDecimal(
      fromWei(web3, await rewards.methods.getPendingLUSDGain(address).call())
    );

    const lqtyAllowance = toDecimal(
      fromWei(
        web3,
        await lqtyToken.methods.allowance(address, rewards._address).call()
      )
    );
    // const STRING_LUSD_LP = 0;

    const rewardsAllowances = {
      LQTY: lqtyAllowance,
    };

    const rewardsBalances = {
      userPending: {
        ETH: pendingETH,
        LUSD: pendingLUSD,
      },
      userStaked: {
        LQTY: lqtyStaked,
      },
    };

    return [rewards, rewardsBalances, rewardsAllowances];
  }
};
