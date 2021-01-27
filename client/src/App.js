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
} from "./utils/handleWallets.js/index";
import {
  fetchETHLPTokens,
  fetchFarm,
  fetchLUSDLPTokens,
  fetchStringToken,
} from "./utils/contractConnection";
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
  const [contracts, setContracts] = useState({});
  const [prices, setPrices] = useState({});

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

  const handleContractConnect = async () => {
    let w = web3DataProvider;
    let w2 = window.web3;
    // const web3 = web3UserProvider;
    const web3 = window.web3;
    // ;
    const networkId = await web3.eth.net.getId();
    const [stringToken, STRING] = await fetchStringToken(
      networkId,
      web3,
      address
    );
    const [ETHLPToken, STRING_ETH_LP] = await fetchETHLPTokens(
      networkId,
      web3,
      address
    );
    const [LUSDLPToken, STRING_LUSD_LP] = await fetchLUSDLPTokens(
      networkId,
      web3,
      address
    );
    const [farm, allowances, farmBalances] = await fetchFarm(
      networkId,
      web3,
      ETHLPToken,
      LUSDLPToken,
      stringToken,
      address
    );
    setFarmBalances(farmBalances);
    setUserAllowances(allowances);
    setContracts({ stringToken, ETHLPToken, LUSDLPToken, farm });
    setUserBalances({ STRING, STRING_ETH_LP, STRING_LUSD_LP });
  };

  const handlePricing = async () => {
    const STRING = 0.1;
    // when all deposited $500mm tvl
    const STRING_ETH_LP = 500;
    const STRING_LUSD_LP = 500;
    setPrices({ STRING, STRING_ETH_LP, STRING_LUSD_LP });
  };

  const handleManualConnect = async () => {
    const res = await manualConnect(
      handleOpenConnectModal,
      address,
      connectModalVisible,
      handleAccountchange
    );

    if (res) {
      setWeb3UserProvider(res[0]);
      setAddress(res[1]);
      // setIsContractConnected(true);
      await checkChain(res[0], toast);
    }
  };

  const reFetchData = async () => {
    await handleContractConnect();
  };

  const toast = useToast();
  useEffect(() => {
    (async () => {
      const dataInstance = await initialConnectForDataCollection();
      if (dataInstance && !web3DataProvider && !address) {
        setWeb3DataProvider(dataInstance);
      }
      // fetch app data
      if (address && web3DataProvider) {
        await handleContractConnect();
        await handlePricing();
      }
    })();
  }, [address]);

  // once connected to the contractss
  useEffect(() => {
    console.log([userAllowances, contracts, userBalances, farmBalances]);
    if (contracts.stringToken) {
      setIsConnected(true);
    }
  }, [prices]);

  const credentials = {
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
    farmBalances,
    userBalances,
    userAllowances,
    setUserAllowances,
    contracts,
    reFetchData,
    prices,
  };

  return (
    <Router history={history}>
      <ChakraProvider>
        <CredentialsProvider value={credentials}>
          <div>
            <Home />
          </div>
        </CredentialsProvider>
      </ChakraProvider>
    </Router>
  );
}

export default App;
