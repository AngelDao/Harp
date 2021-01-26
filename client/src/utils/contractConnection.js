import StringToken from "../abis/StringToken.json";
import Farm from "../abis/LatestFarm.json";
import TestETHLPToken from "../abis/ETHLPToken.json";
import TestLUSDLPToken from "../abis/LUSDLPToken.json";
import { fromWei, toDecimal } from "./truncateString";

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

export const fetchFarm = async (
  networkId,
  web3,
  ETHLPToken,
  LUSDLPToken,
  stringToken,
  address
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
    // debugger;
    const pendingSTRING_ETH_LP = toDecimal(
      fromWei(web3, await farm.methods.pendingString(0, address).call())
    );

    const pendingSTRING_LUSD_LP = toDecimal(
      fromWei(web3, await farm.methods.pendingString(1, address).call())
    );

    const userSTRING_LUSD_LP = toDecimal(
      fromWei(web3, (await farm.methods.userInfo(1, address).call()).amount)
    );

    const allowancesSTRING = toDecimal(
      fromWei(
        web3,
        await stringToken.methods.allowance(address, farm._address).call()
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
      STRING_ETH_LP: allowancesSTRING_ETH_LP,
      STRING_LUSD_LP: allowancesSTRING_LUSD_LP,
    };
    const farmBalances = {
      userPending: {
        STRING_ETH_LP: pendingSTRING_ETH_LP,
        STRING_LUSD_LP: pendingSTRING_LUSD_LP,
      },
      userStaked: {
        STRING_ETH_LP: userSTRING_ETH_LP,
        STRING_LUSD_LP: userSTRING_LUSD_LP,
      },
      totalStaked: {
        STRING_ETH_LP: farmSTRING_ETH_LP,
        STRING_LUSD_LP: farmSTRING_LUSD_LP,
      },
    };
    return [farm, allowances, farmBalances];
  }
};
