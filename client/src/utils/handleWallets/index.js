import { login, setEventListeners } from "./modalConfig";
import { useToast } from "@chakra-ui/react";
import Web3 from "web3";

// user connection flow
export const manualConnect = async (
  handleClose,
  address,
  visible,
  handleAccountchange,
  handleUnsupported,
  setLoading
) => {
  if (!address && !visible) {
    let res;
    try {
      res = await login(
        handleClose,
        handleAccountchange,
        handleUnsupported,
        setLoading
      );
    } catch (err) {
      console.log(err);
    }
    return res;
  }
};

// loading data
export const initialConnectForDataCollection = async () => {
  if (window.ethereum) {
    console.log("Using window.ethereum!");
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    // return window.web3;
    return new Web3(window.ethereum);
  } else if (window.web3) {
    console.log("Using window.web3!");
    return new Web3(window.web3.currentProvider);
  } else {
    console.log("No Wallet Detected, install metamask");
    return null;
    //   return new Rari(
    //     `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`
    //   );
  }
};

export const checkChain = async (instance, toast) => {
  const netId = await instance.eth.net.getId();
  const chainId = await instance.eth.getChainId();
  console.log("Network ID: " + netId, "Chain ID: " + chainId);
  if (netId !== 1 || chainId !== 1) {
    // setTimeout(() => {
    //   toast({
    //     title: "Wrong network!",
    //     description:
    //       "You are on the wrong network! Switch to the mainnet and reload this page!",
    //     status: "warning",
    //     position: "top-right",
    //     duration: 300000,
    //     isClosable: true,
    //   });
    // }, 1500);
  }
};
