import StringToken from "../../abis/StringToken.json";
import Farm from "../../abis/LatestFarm.json";
import TestETHLPToken from "../../abis/ETHLPToken.json";
import TestLUSDLPToken from "../../abis/LUSDLPToken.json";
import gStringToken from "../../abis/gStringToken.json";
import LQTYToken from "../../abis/ILQTYToken.json";
import LUSDToken from "../../abis/ILUSDToken.json";
import StakingPool from "../../abis/StringStaking.json";
import StabilityFactory from "../../abis/StabilityFactory.json";
import StabilityProxy from "../../abis/StabilityProxy.json";
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
  }
  else if (LUSDTokenNetwork) {
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
  }
  else if (LQTYTokenNetwork) {
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
  const ETHLPnetwork = TestETHLPToken.networks[networkId];
  if (ETHLPnetwork) {
    const ETHLPToken = new web3.eth.Contract(
      TestETHLPToken.abi,
      ETHLPnetwork.address
    );
    const STRING_ETH_LP = toDecimal(
      fromWei(web3, await ETHLPToken.methods.balanceOf(address).call())
    );
    return [ETHLPToken, STRING_ETH_LP];
  }
};

export const fetchLUSDLPTokens = async (networkId, web3, address) => {
  const LUSDLPnetwork = TestLUSDLPToken.networks[networkId];
  if (LUSDLPnetwork) {
    const LUSDLPToken = new web3.eth.Contract(
      TestLUSDLPToken.abi,
      LUSDLPnetwork.address
    );
    const STRING_LUSD_LP = toDecimal(
      fromWei(web3, await LUSDLPToken.methods.balanceOf(address).call())
    );
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

    const allowancesSTRING = toDecimal(
      fromWei(
        web3,
        await stringToken.methods.allowance(address, ps._address).call()
      )
    );

    const allowancesgSTRING = toDecimal(
      fromWei(
        web3,
        await gStringToken.methods.allowance(address, ps._address).call()
      )
    );

    const isBoosted = await ps.methods.isBoosted().call();
    const psSTRING = toDecimal(
      fromWei(web3, await stringToken.methods.balanceOf(ps._address).call())
    );
    const pendingSTRING = toDecimal(
      fromWei(web3, await ps.methods.pendingString(address).call())
    );

    // const ammount = (await ps.methods.userInfo(address).call()).amount;
    // const trnced = fromWei(web3, ammount);
    const userSTRINGStaked = toDecimal(
      fromWei(web3, (await ps.methods.userInfo(address).call()).amount)
    );

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
    const pendingSTRING_ETH_LP = toDecimal(
      fromWei(web3, await farm.methods.pendingString(0, address).call())
    );

    const pendingSTRING_LUSD_LP = toDecimal(
      fromWei(web3, await farm.methods.pendingString(1, address).call())
    );

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
    const factory = new web3.eth.Contract(
      StabilityFactory.abi,
      SFNetwork.address
    );

    let userProxy = await factory.methods.userProxys(address).call();
    if (
      userProxy.proxyAddress === "0x0000000000000000000000000000000000000000"
    ) {
      userProxy = null;
    } else {
      userProxy = new web3.eth.Contract(
        StabilityProxy.abi,
        userProxy.proxyAddress
      );
    }
    const totalLUSD = toDecimal(
      fromWei(web3, await factory.methods.totalLUSD().call())
    );

    let allowanceLUSD;
    if (userProxy) {
      allowanceLUSD = toDecimal(
        fromWei(
          web3,
          await lusdToken.methods.allowance(address, userProxy._address).call()
        )
      );
    } else {
      allowanceLUSD = 0;
    }

    const isBoosted = await factory.methods.isBoosted().call();
    const pendingSTRING = await factory.methods.pendingString(address).call();

    const proxyAllowances = {
      LUSD: allowanceLUSD,
    };

    const proxyBalances = {
      userPending: {
        STRING: pendingSTRING,
      },
      userStaked: {
        LUSD: userProxy ? userProxy.amount : 0,
      },
    };

    const fyBalances = {
      isBoosted,
      totalStaked: {
        LUSD: totalLUSD,
      },
    };
    debugger
    return [factory, userProxy, proxyAllowances, fyBalances, proxyBalances];
  }
};
