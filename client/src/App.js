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
} from "./utils/HandleWallets.js/index";
import {
  fetchETHLPTokens,
  fetchFarm,
  fetchLUSDLPTokens,
  fetchStringToken,
} from "./utils/contractConnection";

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

  const handleOpenConnectModal = () => {
    setConnectModalVisible(false);
  };

  const handleCloseConnectModal = () => {
    setConnectModalVisible(true);
  };

  const handleContractConnect = async () => {
    const web3 = web3UserProvider;
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

  const handleManualConnect = async () => {
    const res = await manualConnect(
      handleOpenConnectModal,
      address,
      connectModalVisible
    );

    if (res) {
      setAddress(res[1]);
      setWeb3UserProvider(res[0]);
      setIsContractConnected(true);
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
      if (address && web3DataProvider && !isConnected) {
        await handleContractConnect();
      }
    })();
  }, [isContractConnected]);

  // once connected to the contractss
  useEffect(() => {
    console.log([userAllowances, contracts, userBalances, farmBalances]);
    if (contracts.stringToken) {
      setIsConnected(true);
    }
  }, [userBalances]);

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
