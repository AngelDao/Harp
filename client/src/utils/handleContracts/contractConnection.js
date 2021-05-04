import StringToken from "../../abis/StringToken.json";
import Farm from "../../abis/Farm.json";
import gStringToken from "../../abis/gStringToken.json";
import LQTYToken from "../../abis/ILQTYToken.json";
import LUSDToken from "../../abis/ILUSDToken.json";
import IERC20 from "../../abis/IERC20.json";
import ILQTYStaking from "../../abis/ILQTYStaking.json";
import StakingPool from "../../abis/StringStaking.json";
import StabilityFactory from "../../abis/StabilityFactory.json";
import StabilityProxy from "../../abis/StabilityProxy.json";
import IStabilityPool from "../../abis/IStabilityPool.json";
import IBorrowOperations from "../../abis/IBorrowerOperations.json";
import ITroveManager from "../../abis/ITroveManager.json";
import ISortedTroves from "../../abis/ISortedTroves.json";
import IPriceFeed from "../../abis/IPriceFeed.json";
import IHintHelpers from "../../abis/HintHelpers.json";
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

    const ETH = fromWei(web3, await web3.eth.getBalance(address));

    return [gstringToken, gSTRING, ETH];
  }
};

export const fetchLUSDToken = async (networkId, web3, address) => {
  const LUSDTokenNetwork = LUSDToken.networks[networkId];
  let lusdToken;

  if (networkId === 42) {
    lusdToken = new web3.eth.Contract(LUSDToken.abi, addresses.kovan.lusdToken);
  } else if (networkId === 4) {
    lusdToken = new web3.eth.Contract(
      LUSDToken.abi,
      addresses.rinkeby.lusdToken
    );
  } else if (networkId === 1) {
    lusdToken = new web3.eth.Contract(
      LUSDToken.abi,
      addresses.mainnet.lusdToken
    );
  }
  const LUSD = toDecimal(
    fromWei(web3, await lusdToken.methods.balanceOf(address).call())
  );

  return [lusdToken, LUSD];
};

export const fetchLQTYToken = async (networkId, web3, address) => {
  const LQTYTokenNetwork = LQTYToken.networks[networkId];
  let lqtyToken;
  if (networkId === 42) {
    lqtyToken = new web3.eth.Contract(LQTYToken.abi, addresses.kovan.lqtyToken);
  } else if (networkId === 4) {
    lqtyToken = new web3.eth.Contract(
      LQTYToken.abi,
      addresses.rinkeby.lqtyToken
    );
  } else if (networkId === 1) {
    lqtyToken = new web3.eth.Contract(
      LQTYToken.abi,
      addresses.mainnet.lqtyToken
    );
  }

  const LQTY = toDecimal(
    fromWei(web3, await lqtyToken.methods.balanceOf(address).call())
  );
  return [lqtyToken, LQTY];
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
  let ETHLPToken;
  if (networkId === 42) {
    ETHLPToken = new web3.eth.Contract(IERC20.abi, addresses.kovan.ethLPToken);
  }
  if (networkId === 4) {
    ETHLPToken = new web3.eth.Contract(
      IERC20.abi,
      addresses.rinkeby.ethLPToken
    );
  }
  if (networkId === 1) {
    ETHLPToken = new web3.eth.Contract(
      IERC20.abi,
      addresses.mainnet.ethLPToken
    );
  }

  const temp = fromWei(
    web3,
    await ETHLPToken.methods.balanceOf(address).call()
  );

  // const STRING_ETH_LP = 0;
  const STRING_ETH_LP = toDecimal(
    fromWei(web3, await ETHLPToken.methods.balanceOf(address).call())
  );
  return [ETHLPToken, STRING_ETH_LP];
};

export const fetchLUSDLPTokens = async (networkId, web3, address) => {
  let LUSDLPToken;
  if (networkId === 42) {
    LUSDLPToken = new web3.eth.Contract(
      IERC20.abi,
      addresses.kovan.lusdLPToken
    );
  }
  if (networkId === 4) {
    LUSDLPToken = new web3.eth.Contract(
      IERC20.abi,
      addresses.rinkeby.lusdLPToken
    );
  }
  if (networkId === 1) {
    LUSDLPToken = new web3.eth.Contract(
      IERC20.abi,
      addresses.mainnet.lusdLPToken
    );
  }

  const STRING_LUSD_LP = toDecimal(
    fromWei(web3, await LUSDLPToken.methods.balanceOf(address).call())
  );
  // const STRING_LUSD_LP = 0;

  return [LUSDLPToken, STRING_LUSD_LP];
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

    const isBoosted = await ps.methods.isBoosted().call();
    // debugger;
    const psSTRING = toDecimal(
      fromWei(web3, await stringToken.methods.balanceOf(ps._address).call())
    );
    // debugger;
    const pendingSTRING = toDecimal(
      fromWei(web3, await ps.methods.pendingString(address).call())
    );

    // const pendingLQTY = 0;
    // debugger;
    let pendingLQTY;
    try {
      pendingLQTY = toDecimal(
        fromWei(web3, await ps.methods.pendingLQTY(address).call())
      );
    } catch (err) {
      console.log(err);
      pendingLQTY = 0;
    }
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
        LQTY: pendingLQTY,
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

    let farmSTRING_ETH_LP;
    try {
      farmSTRING_ETH_LP = toDecimal(
        fromWei(web3, await ETHLPToken.methods.balanceOf(farm._address).call())
      );
    } catch (err) {
      farmSTRING_ETH_LP = 0;
    }
    let farmSTRING_LUSD_LP;
    try {
      farmSTRING_LUSD_LP = toDecimal(
        fromWei(web3, await LUSDLPToken.methods.balanceOf(farm._address).call())
      );
    } catch (err) {
      farmSTRING_LUSD_LP = 0;
    }

    const userSTRING_ETH_LP = toDecimal(
      fromWei(web3, (await farm.methods.userInfo(0, address).call()).amount)
    );

    let pendingSTRING_ETH_LP;
    try {
      pendingSTRING_ETH_LP = toDecimal(
        fromWei(web3, await farm.methods.pendingString(0, address).call())
      );
    } catch (err) {
      console.log(err);
      pendingSTRING_ETH_LP = 0;
    }

    let pendingSTRING_LUSD_LP;
    try {
      pendingSTRING_LUSD_LP = toDecimal(
        fromWei(web3, await farm.methods.pendingString(1, address).call())
      );
    } catch (err) {
      console.log(err);
      pendingSTRING_LUSD_LP = 0;
    }

    let userSTRING_LUSD_LP;
    try {
      userSTRING_LUSD_LP = toDecimal(
        fromWei(web3, (await farm.methods.userInfo(1, address).call()).amount)
      );
    } catch (err) {
      console.log(err);
      userSTRING_LUSD_LP = 0;
    }

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
    let allowancesSTRING_ETH_LP;

    try {
      allowancesSTRING_ETH_LP = toDecimal(
        fromWei(
          web3,
          await ETHLPToken.methods.allowance(address, farm._address).call()
        )
      );
    } catch (err) {
      allowancesSTRING_ETH_LP = 0;
    }

    let allowancesSTRING_LUSD_LP;
    try {
      allowancesSTRING_LUSD_LP = toDecimal(
        fromWei(
          web3,
          await LUSDLPToken.methods.allowance(address, farm._address).call()
        )
      );
    } catch (err) {
      allowancesSTRING_LUSD_LP = 0;
    }

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
  lusdToken,
  lqtyToken
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
      if (networkId === 42) {
        stabilityPool = new web3.eth.Contract(
          IStabilityPool.abi,
          addresses.kovan.stabilityPool
        );
      }
      if (networkId === 4) {
        stabilityPool = new web3.eth.Contract(
          IStabilityPool.abi,
          addresses.rinkeby.stabilityPool
        );
      }
      if (networkId === 1) {
        stabilityPool = new web3.eth.Contract(
          IStabilityPool.abi,
          addresses.mainnet.stabilityPool
        );
      }
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

      pendingETH = toDecimal(
        fromWei(
          web3,
          await stabilityPool.methods
            .getDepositorETHGain(userProxy._address)
            .call()
        )
      );

      pendingLQTY = toDecimal(
        fromWei(
          web3,
          await stabilityPool.methods
            .getDepositorLQTYGain(userProxy._address)
            .call()
        )
      );

      const readyLQTY = toDecimal(
        fromWei(
          web3,
          await lqtyToken.methods.balanceOf(userProxy._address).call()
        )
      );

      pendingLQTY = (
        parseFloat(pendingLQTY) + parseFloat(readyLQTY)
      ).toString();
      // debugger;
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
  let rewards;
  if (networkId === 42) {
    rewards = new web3.eth.Contract(
      ILQTYStaking.abi,
      addresses.kovan.lqtyStaking
    );
  }
  if (networkId === 4) {
    rewards = new web3.eth.Contract(
      ILQTYStaking.abi,
      addresses.rinkeby.lqtyStaking
    );
  }
  if (networkId === 1) {
    rewards = new web3.eth.Contract(
      ILQTYStaking.abi,
      addresses.mainnet.lqtyStaking
    );
  }

  const lqtyStaked = toDecimal(
    fromWei(web3, await rewards.methods.stakes(address).call())
  );

  const pendingETH = toDecimal(
    fromWei(web3, await rewards.methods.getPendingETHGain(address).call())
  );

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
};

export const fetchBorrow = async (web3, networkId, address) => {
  let borrow;
  if (networkId === 4) {
    borrow = new web3.eth.Contract(
      IBorrowOperations.abi,
      addresses.rinkeby.borrowerOperations
    );
  } else if (networkId === 42) {
    borrow = new web3.eth.Contract(
      IBorrowOperations.abi,
      addresses.kovan.borrowerOperations
    );
  } else if (networkId === 1) {
    borrow = new web3.eth.Contract(
      IBorrowOperations.abi,
      addresses.mainnet.borrowerOperations
    );
  }
  return [borrow];
};

export const fetchTroveManager = async (web3, networkId, address) => {
  let troveManager;
  if (networkId === 4) {
    troveManager = new web3.eth.Contract(
      ITroveManager.abi,
      addresses.rinkeby.troveManager
    );
  } else if (networkId === 42) {
    troveManager = new web3.eth.Contract(
      ITroveManager.abi,
      addresses.kovan.troveManager
    );
  } else if (networkId === 1) {
    troveManager = new web3.eth.Contract(
      ITroveManager.abi,
      addresses.mainnet.troveManager
    );
  }

  const borrowRate = parseFloat(
    fromWei(web3, await troveManager.methods.getBorrowingRate().call())
  );
  const troveCount = await troveManager.methods.getTroveOwnersCount().call();
  const userTrove = await troveManager.methods.Troves(address).call();

  return [troveManager, troveCount, userTrove, borrowRate];
};

export const fetchSortedTroves = async (web3, networkId, troveManager) => {
  let sortedTroves;
  if (networkId === 4) {
    sortedTroves = new web3.eth.Contract(
      ISortedTroves.abi,
      addresses.rinkeby.sortedTroves
    );
  } else if (networkId === 42) {
    sortedTroves = new web3.eth.Contract(
      ISortedTroves.abi,
      addresses.kovan.sortedTroves
    );
  } else if (networkId === 1) {
    sortedTroves = new web3.eth.Contract(
      ISortedTroves.abi,
      addresses.mainnet.sortedTroves
    );
  }

  const pageSize = 10;
  const trovePages = { 1: [] };
  let lastTrove = null;

  for (let i = 0; i < pageSize; i++) {
    let troveOwner;
    if (!lastTrove) {
      troveOwner = await sortedTroves.methods.getLast().call();
    } else {
      troveOwner = await sortedTroves.methods.getPrev(lastTrove).call();
    }
    if (
      troveOwner &&
      troveOwner !== "0x0000000000000000000000000000000000000000"
    ) {
      const trove = await troveManager.methods.Troves(troveOwner).call();
      lastTrove = troveOwner;
      trovePages[1].push({ owner: troveOwner, trove });
    } else {
      break;
    }
  }

  return [sortedTroves, trovePages];
};

export const fetchHintHelpers = async (web3, networkId) => {
  let hintHelpers;
  if (networkId === 4) {
    hintHelpers = new web3.eth.Contract(
      IHintHelpers.abi,
      addresses.rinkeby.hintHelpers
    );
  } else if (networkId === 42) {
    hintHelpers = new web3.eth.Contract(
      IHintHelpers.abi,
      addresses.kovan.hintHelpers
    );
  } else if (networkId === 1) {
    hintHelpers = new web3.eth.Contract(
      IHintHelpers.abi,
      addresses.mainnet.hintHelpers
    );
  }
  return [hintHelpers];
};

export const fetchStabilityPool = async (
  web3,
  networkId,
  address,
  lusdToken,
  ps
) => {
  let sp;
  // debugger;
  if (networkId === 4) {
    sp = new web3.eth.Contract(
      IStabilityPool.abi,
      addresses.rinkeby.stabilityPool
    );
  } else if (networkId === 42) {
    sp = new web3.eth.Contract(
      IStabilityPool.abi,
      addresses.kovan.stabilityPool
    );
  } else if (networkId === 1) {
    sp = new web3.eth.Contract(
      IStabilityPool.abi,
      addresses.mainnet.stabilityPool
    );
  }

  // debugger;
  const lusdAllowance = toDecimal(
    fromWei(
      web3,
      await lusdToken.methods.allowance(address, sp._address).call()
    )
  );

  // debugger;
  const pendingLQTY = toDecimal(
    fromWei(web3, await sp.methods.getDepositorLQTYGain(address).call())
  );

  // debugger;
  const pendingETH = toDecimal(
    fromWei(web3, await sp.methods.getDepositorETHGain(address).call())
  );

  // debugger;
  const lusdStaked = toDecimal(
    fromWei(web3, await sp.methods.getCompoundedLUSDDeposit(address).call())
  );

  const spAllowances = {
    LUSD: lusdAllowance,
  };

  const spBalances = {
    userPending: {
      ETH: pendingETH,
      LQTY: pendingLQTY,
    },
    userStaked: {
      LUSD: lusdStaked,
    },
  };

  return [sp, spAllowances, spBalances];
};

export const fetchPriceFeed = async (networkId, web3) => {
  let pf;
  // debugger;
  if (networkId === 4) {
    pf = new web3.eth.Contract(IPriceFeed.abi, addresses.rinkeby.priceFeed);
  } else if (networkId === 42) {
    pf = new web3.eth.Contract(IPriceFeed.abi, addresses.kovan.priceFeed);
  } else if (networkId === 1) {
    pf = new web3.eth.Contract(IPriceFeed.abi, addresses.mainnet.priceFeed);
  }

  const ethPrice = toDecimal(
    fromWei(web3, await pf.methods.lastGoodPrice().call())
  );

  return [pf, ethPrice];
};
