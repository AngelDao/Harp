import Web3 from "web3";

export const truncateAddress = (str, n) => {
  if (!str) return null;
  return str.substr(0, 6) + "..." + str.substr(str.length - 4, str.length - 1);
};

export const fromWei = (web3, n) => {
  debugger;
  return web3.utils.fromWei(n, "ether");
};

export const toWei = (web3, n) => {
  return web3.utils.toWei(n, "ether");
};
