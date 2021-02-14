import Web3 from "web3";

const launchModal = async (handleClose, handleAccountchange) => {
  const [
    WalletConnectProvider,
    Portis,
    Authereum,
    Fortmatic,
    Torus,
    Web3Modal,
  ] = await Promise.all([
    import("@walletconnect/web3-provider"),
    import("@portis/web3"),
    import("authereum"),
    import("fortmatic"),
    import("@toruslabs/torus-embed"),
    import("web3modal"),
  ]);

  const providerOptions = {
    injected: {
      display: {
        description: "Connect with a browser extension",
      },
      package: null,
    },
    walletconnect: {
      package: WalletConnectProvider.default,
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID,
      },
      display: {
        description: "Scan with a wallet to connect",
      },
    },
    fortmatic: {
      package: Fortmatic.default,
      options: {
        key: process.env.REACT_APP_FORTMATIC_KEY,
      },
      display: {
        description: "Connect with your Fortmatic account",
      },
    },
    torus: {
      package: Torus.default,
      display: {
        description: "Connect with your Torus account",
      },
    },
    portis: {
      package: Portis.default,
      options: {
        id: process.env.REACT_APP_PORTIS_ID,
      },
      display: {
        description: "Connect with your Portis account",
      },
    },
    authereum: {
      package: Authereum.default,
      display: {
        description: "Connect with your Authereum account",
      },
    },
  };

  const web3Modal = new Web3Modal.default({
    cacheProvider: false,
    providerOptions,
    theme: {
      background: "#F0E8F3",
      main: "#160D19",
      secondary: "#361F3F",
      hover: "#B38AC5",
    },
  });

  web3Modal.on("close", handleClose);

  const provider = await web3Modal.connect();
  setEventListeners(provider, handleAccountchange);
  return provider;
};

export const setEventListeners = (instance, handleAccountchange) => {
  instance
    .on("accountsChanged", (log) => {
      console.log("accountsChanged", log);
      handleAccountchange(log[0]);
    })
    .on("connected", (log) => {
      console.log("connected", log);
    })
    .on("chainChanged", (log) => {
      console.log("chainChanged", log);
    });
};

export const login = async (handleClose, handleAccountchange) => {
  const provider = await launchModal(handleClose, handleAccountchange);
  const instance = new Web3(provider);
  const addresses = await instance.eth.getAccounts();
  console.log("Address array: ", addresses);
  if (addresses.length === 0) {
    console.log("Address array was empty. Reloading!");
    window.location.reload();
  }
  const address = addresses[0];
  // setEventListeners(instance, address);
  // setEventListeners(window.web3, address);
  return [instance, address];
};