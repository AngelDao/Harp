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

function App() {
  const [connectModalVisible, setConnectModalVisible] = useState(null);
  const [isConnected, setIsConnected] = useState(null);
  const [address, setAddress] = useState(null);
  const [web3DataProvider, setWeb3DataProvider] = useState(null);
  const [web3UserProvider, setWeb3UserProvider] = useState(null);

  const handleOpenConnectModal = () => {
    setConnectModalVisible(false);
  };

  const handleCloseConnectModal = () => {
    setConnectModalVisible(true);
  };

  const handleManualConnect = async () => {
    debugger;
    const res = await manualConnect(
      handleOpenConnectModal,
      address,
      connectModalVisible
    );

    if (res) {
      setAddress(res[1]);
      setWeb3UserProvider(res[0]);
      setIsConnected(true);
      await checkChain(toast);
    }
  };

  const toast = useToast();
  useEffect(() => {
    (async () => {
      console.log("initial instance connection");
      const dataInstance = initialConnectForDataCollection();
      if (dataInstance && !web3DataProvider) {
        setWeb3DataProvider(dataInstance);
        // fetch app data
      }
    })();
  }, [web3DataProvider, web3UserProvider]);

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
