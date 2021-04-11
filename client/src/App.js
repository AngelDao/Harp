import React, { useState, useEffect } from "react";
import Home from "./containers/Home";
import { Router } from "react-router-dom";
import { CredentialsProvider } from "./context/credentialsContext";
import history from "./utils/history";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import {
  initialConnectForDataCollection,
  manualConnect,
  checkChain,
} from "./utils/handleWallets/index";
import {
  fetchETHLPTokens,
  fetchFarm,
  fetchStringToken,
  fetchLUSDLPTokens,
  fetchLQTYToken,
  fetchLUSDToken,
  fetchgStringToken,
  fetchProfitShare,
  fetchStabilityFactory,
  fetchRewards,
  fetchBorrow,
  fetchTroveManager,
  fetchSortedTroves,
  fetchHintHelpers,
} from "./utils/handleContracts/contractConnection";
import { fetchPrices, fetchTest } from "./utils/handlePriceData";
import { fetchTVL } from "./utils/handleContracts/contractTVL";
// import { setEventListeners } from "./utils/handleWallets.js/modalConfig";

function App() {
  const [connectModalVisible, setConnectModalVisible] = useState(null);
  const [isConnected, setIsConnected] = useState(null);
  const [isContractConnected, setIsContractConnected] = useState(null);
  const [address, setAddress] = useState(null);
  const [web3DataProvider, setWeb3DataProvider] = useState(null);
  const [web3UserProvider, setWeb3UserProvider] = useState(null);
  const [userBalances, setUserBalances] = useState({});
  const [userAllowances, setUserAllowances] = useState({});
  const [farmBalances, setFarmBalances] = useState({});
  const [proxyBalances, setProxyBalances] = useState({});
  const [profitShareBalances, setProfitShareBalances] = useState({});
  const [factoryBalances, setFactoryBalances] = useState({});
  const [rewardsBalances, setRewardsBalances] = useState({});
  const [contracts, setContracts] = useState({});
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [sending, setSending] = useState(false);
  const [tvl, setTVL] = useState(false);
  const [scheduler, setScheduler] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [network, setNetwork] = useState(false);
  const [schedulerID, setSchedulerID] = useState(null);
  const [troves, setTroves] = useState(false);
  const [userTrove, setUserTrove] = useState(false);
  const [liquityGlobals, setLiquityGlobals] = useState(false);
  const [borrowRate, setBorrowRate] = useState(false);

  const handleOpenConnectModal = () => {
    setConnectModalVisible(false);
  };

  const handleCloseConnectModal = () => {
    setConnectModalVisible(true);
  };

  const handleAccountchange = async (newAcc) => {
    setAddress(newAcc);
    // await reFetchData();
  };

  const handleUnsupported = (code) => {
    if (code === "0x2a" || code === "0x4") {
      setUnsupported(false);
      setNetwork(code === "0x2a" ? "kovan" : "rinkeby");
    } else {
      setUnsupported(true);
      setLoading(false);
      setNetwork(false);
    }
  };

  const handleContractConnect = async () => {
    console.log("gather contracts");
    let w = web3DataProvider;
    let w2 = window.web3;
    // const web3 = web3UserProvider;
    const web3 = window.web3;
    // ;
    const networkId = await web3.eth.net.getId();

    const [gStringToken, gSTRING, ETH] = await fetchgStringToken(
      networkId,
      web3,
      address
    );
    // debugger;
    const [lusdToken, LUSD] = await fetchLUSDToken(networkId, web3, address);
    // debugger;
    const [lqtyToken, LQTY] = await fetchLQTYToken(networkId, web3, address);
    // debugger;

    const [stringToken, STRING] = await fetchStringToken(
      networkId,
      web3,
      address
    );
    // debugger;
    const [ETHLPToken, gSTRING_ETH_LP] = await fetchETHLPTokens(
      networkId,
      web3,
      address
    );
    // debugger;
    const [LUSDLPToken, gSTRING_LUSD_LP] = await fetchLUSDLPTokens(
      networkId,
      web3,
      address
    );
    // debugger;
    const [farm, allowances, farmBalances] = await fetchFarm(
      networkId,
      web3,
      ETHLPToken,
      LUSDLPToken,
      stringToken,
      address,
      lusdToken
    );
    // debugger;

    const [profitShare, psAllowances, psBalances] = await fetchProfitShare(
      networkId,
      web3,
      stringToken,
      gStringToken,
      address
    );
    // debugger;

    const [
      factory,
      proxy,
      proxyAllowance,
      fyBalances,
      proxyBalances,
    ] = await fetchStabilityFactory(networkId, web3, address, lusdToken);

    const [rewards, rwsBalances, rwsAllowances] = await fetchRewards(
      networkId,
      web3,
      address,
      lqtyToken
    );

    const [borrow] = await fetchBorrow(web3, networkId, address);
    const [
      troveManager,
      troveCount,
      userTrove,
      borrowRate,
    ] = await fetchTroveManager(web3, networkId, address);
    const [sortedTroves, sTroves] = await fetchSortedTroves(
      web3,
      networkId,
      troveManager
    );

    const [hintHelpers] = await fetchHintHelpers(web3, networkId);

    // debugger;
    if (!troves) {
      setTroves({ troveCount, troves: sTroves });
    }
    setLiquityGlobals({ borrowRate });
    setBorrowRate(borrowRate);
    setUserTrove(userTrove);
    setRewardsBalances(rwsBalances);
    setFarmBalances(farmBalances);
    setProfitShareBalances(psBalances);
    setFactoryBalances(fyBalances);
    setProxyBalances(proxyBalances);
    setUserAllowances({
      farm: allowances,
      profitShare: psAllowances,
      proxy: proxyAllowance,
      rewards: rwsAllowances,
    });
    setContracts({
      hintHelpers,
      borrow,
      sortedTroves,
      troveManager,
      factory,
      proxy,
      rewards,
      profitShare,
      stringToken,
      ETHLPToken,
      LUSDLPToken,
      farm,
      gStringToken,
      lusdToken,
      lqtyToken,
    });
    setUserBalances({
      STRING,
      gSTRING_ETH_LP,
      gSTRING_LUSD_LP,
      LQTY,
      gSTRING,
      LUSD,
      ETH,
    });
  };

  const handlePricing = async () => {
    console.log("gather pricing");
    let [ETH, LUSD, LQTY] = await fetchPrices();
    const STRING = 0.1;
    const gSTRING = 0.1;

    const prc = {
      LQTY: LQTY ? LQTY : 0,
      LUSD: LUSD ? LUSD : 0,
      STRING,
      ETH: ETH ? ETH : 0,
      gSTRING,
    };
    console.log("gather tvl");
    const [tvl, eprice, lprice, TCR] = await fetchTVL(
      window.web3,
      prc,
      contracts
    );
    setTVL(tvl);
    setLiquityGlobals({ ...liquityGlobals, TCR });
    setPrices({
      ...prc,
      gSTRING_ETH_LP: eprice,
      gSTRING_LUSD_LP: lprice,
    });
  };

  const handleManualConnect = async (reconnectParam) => {
    console.log("handle manual connect");
    const res = await manualConnect(
      handleOpenConnectModal,
      reconnectParam ? null : address,
      connectModalVisible,
      handleAccountchange,
      handleUnsupported,
      setLoading
    );

    if (res) {
      setWeb3UserProvider(res[0]);
      handleUnsupported(res[0].currentProvider.chainId);
      setAddress(res[1]);
      // await checkChain(res[0], toast);
      // setIsContractConnected(true);
    }
  };

  const reFetchData = async () => {
    await handleContractConnect();
    await handlePricing;
  };

  const toast = useToast();
  useEffect(() => {
    (async () => {
      const dataInstance = await initialConnectForDataCollection();
      if (dataInstance && !web3DataProvider && !address) {
        setWeb3DataProvider(dataInstance);
      }

      if (address === "reconnect") {
        handleManualConnect(true);
        setTVL(false);
        setPrices(false);
      }
      // fetch app data
      if (
        address &&
        address !== "reconnect" &&
        web3DataProvider &&
        !unsupported
      ) {
        if (!schedulerID) {
          await handleContractConnect();
        } else {
          clearInterval(schedulerID);
          setIsConnected(false);
          setSchedulerID(false);
        }
      }
    })();
  }, [address]);

  // once connected to the contractss
  useEffect(() => {
    if (!tvl && contracts.stringToken) {
      (async () => {
        await handlePricing();
        setIsConnected(true);
        setLoading(false);
        if (!scheduler && prices) {
          setScheduler(true);
        }
      })();
    }
  }, [contracts]);

  useEffect(() => {
    if (scheduler) {
      const id = setInterval(async () => {
        if (network) {
          await handleContractConnect();
          await handlePricing();
        }
      }, 1000 * 10);
      setSchedulerID(id);
    }
  }, [scheduler]);

  useEffect(() => {
    if (!network && schedulerID) {
      clearInterval(schedulerID);
      setIsConnected(false);
      setSchedulerID(false);
    }
  }, [network]);

  const credentials = {
    rewardsBalances,
    factoryBalances,
    profitShareBalances,
    userBalances,
    proxyBalances,
    farmBalances,
    web3DataProvider,
    setWeb3DataProvider,
    web3UserProvider,
    setWeb3UserProvider,
    isConnected,
    setIsConnected,
    address,
    setAddress,
    connectModalVisible,
    setConnectModalVisible,
    handleManualConnect,
    handleOpenConnectModal,
    handleCloseConnectModal,
    userAllowances,
    setUserAllowances,
    contracts,
    reFetchData,
    prices,
    loading,
    sending,
    setSending,
    unsupported,
    tvl,
    hasAgreed,
    setHasAgreed,
    network,
    troves,
    setTroves,
    userTrove,
    borrowRate,
  };

  return (
    <Router history={history}>
      <ChakraProvider>
        <CredentialsProvider value={credentials}>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div>
            <Home />
          </div>
        </CredentialsProvider>
      </ChakraProvider>
    </Router>
  );
}

export default App;
