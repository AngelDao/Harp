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
import StringToken from "./abis/StringToken.json";
import Farm from "./abis/LatestFarm.json";
import TestETHLPToken from "./abis/ETHLPToken.json";
import TestLUSDLPToken from "./abis/LUSDLPToken.json";

function App() {
  const [connectModalVisible, setConnectModalVisible] = useState(null);
  const [isConnected, setIsConnected] = useState(null);
  const [isContractConnected, setIsContractConnected] = useState(null);
  const [address, setAddress] = useState(null);
  const [web3DataProvider, setWeb3DataProvider] = useState(null);
  const [web3UserProvider, setWeb3UserProvider] = useState(null);
  const [userBalances, setUserBalances] = useState({
    STRING_LUSD_LP: 0,
    STRING_ETH_LP: 0,
    STRING: 0,
    ETH: 0,
    LUSD: 0,
    LQTY: 0,
  });
  const [farmBalances, setFarmBalances] = useState({
    userStaked: {
      STRING_LUSD_LP: 0,
      STRING_ETH_LP: 0,
    },
    totalStaked: {
      STRING_ETH_LP: 0,
      STRING_LUSD_LP: 0,
    },
    totalValueLocked: 0,
  });
  const [contracts, setContracts] = useState({});

  const handleOpenConnectModal = () => {
    setConnectModalVisible(false);
  };

  const handleCloseConnectModal = () => {
    setConnectModalVisible(true);
  };

  const handleContractConnect = async () => {
    const web3 = web3DataProvider;
    let tempContracts = {};
    let tempUserBalances = {};
    const networkId = await web3.eth.net.getId();
    // Load StringToken
    const stringTokenNetwork = StringToken.networks[networkId];
    if (stringTokenNetwork) {
      const stringToken = new web3.eth.Contract(
        StringToken.abi,
        stringTokenNetwork.address
      );
      const STRING = await stringToken.methods.balanceOf(address).call();
      tempContracts = { stringToken };
      tempUserBalances = { STRING };
    }

    let ETHLPToken;
    // Load STRING-ETH-UNI-LP
    const ETHLPnetwork = TestETHLPToken.networks[networkId];
    if (ETHLPnetwork) {
      ETHLPToken = new web3.eth.Contract(
        TestETHLPToken.abi,
        ETHLPnetwork.address
      );
      const STRING_ETH_LP = await ETHLPToken.methods.balanceOf(address).call();
      tempContracts = { ...tempContracts, ETHLPToken };
      tempUserBalances = { ...tempUserBalances, STRING_ETH_LP };
    }

    let LUSDLPToken;
    // Load STRING-LUSD-UNI-LP
    const LUSDLPnetwork = TestLUSDLPToken.networks[networkId];
    if (LUSDLPnetwork) {
      LUSDLPToken = new web3.eth.Contract(
        TestLUSDLPToken.abi,
        LUSDLPnetwork.address
      );
      const STRING_LUSD_LP = await LUSDLPToken.methods
        .balanceOf(address)
        .call();
      tempContracts = { ...tempContracts, LUSDLPToken };
      tempUserBalances = { ...tempUserBalances, STRING_LUSD_LP };
    }

    // Load Farm
    const farmNetwork = Farm.networks[networkId];
    if (farmNetwork) {
      const farm = new web3.eth.Contract(Farm.abi, farmNetwork.address);
      const farmSTRING_ETH_LP = await ETHLPToken.methods
        .balanceOf(farm._address)
        .call();
      const farmSTRING_LUSD_LP = await LUSDLPToken.methods
        .balanceOf(farm._address)
        .call();
      const userSTRING_ETH_LP = (await farm.methods.userInfo(0, address).call())
        .amount;

      const userSTRING_LUSD_LP = (
        await farm.methods.userInfo(1, address).call()
      ).amount;

      tempContracts = { ...tempContracts, farm };
      setFarmBalances({
        ...farmBalances,
        userStaked: {
          ...farmBalances.userStaked,
          STRING_ETH_LP: userSTRING_ETH_LP,
          STRING_LUSD_LP: userSTRING_LUSD_LP,
        },
        totalStaked: {
          STRING_ETH_LP: farmSTRING_ETH_LP,
          STRING_LUSD_LP: farmSTRING_LUSD_LP,
        },
      });
    }
    setContracts(tempContracts);
    setUserBalances(tempUserBalances);
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

  const toast = useToast();
  useEffect(() => {
    (async () => {
      const dataInstance = initialConnectForDataCollection();
      if (dataInstance && !web3DataProvider && !address) {
        setWeb3DataProvider(dataInstance);
        // fetch app data
      }
      if (address && web3DataProvider && !isConnected) {
        await handleContractConnect();
      }
    })();
  }, [isContractConnected]);

  // debug purposes
  useEffect(() => {
    console.log([contracts, userBalances, farmBalances]);
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
