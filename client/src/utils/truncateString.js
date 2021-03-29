import Web3 from "web3";

export const truncateAddress = (str, n) => {
  if (!str) return null;
  return str.substr(0, 6) + "..." + str.substr(str.length - 4, str.length - 1);
};

export const fromWei = (web3, n) => {
  return web3.utils.fromWei(n, "micro");
};

export const toWei = (web3, n) => {
  let test = web3.utils.toWei(n, "ether");
  return web3.utils.toWei(n, "ether");
};

export const toDecimal = (n) => {
  let temp = n.replace(/[.].+$/g, "");
  if (n.length <= 1) {
    return "0";
  }

  if (temp.length <= 2) {
    return "0";
  }

  if (temp.length <= 3) {
    return `.000${temp[0]}`;
  }

  const end = temp.substr(temp.length - 6, 4);
  const diff = temp.substr(temp.length - 6, 6);
  const start = temp.replace(diff, "");
  // ;
  // ;
  return `${start}.${end}`;
};
