import Web3 from "web3";
import { InfoTable } from "../components/Farm/Pool/styles";

export const truncateAddress = (str, n) => {
  if (!str) return null;
  return str.substr(0, 6) + "..." + str.substr(str.length - 4, str.length - 1);
};

export const fromWei = (web3, n) => {
  return web3.utils.fromWei(n, "ether");
};

export const toWei = (web3, n) => {
  let test = web3.utils.toWei(n, "ether");
  return web3.utils.toWei(n, "ether");
};

export const toDecimal = (n) => {
  return n;
};

export const truncDust = (n) => {
  debugger;
  if (!n) {
    return 0;
  }
  const temp = n.toString();
  let allDec = temp.match(/[.](.+)/i);
  allDec = allDec && allDec[1];
  if (allDec && allDec.length > 9 && parseFloat(temp) < 0.000000001) {
    return "Dust";
  } else if (allDec && allDec.length > 9) {
    return temp.match(/.+[.].{9}/g)[0];
  } else {
    return temp;
  }
};

export const readableTrunc = (str) => {
  let temp = str.replace(/[.].+$/g, "");

  if (temp.length === 6) {
    return temp[0] + temp[1] + temp[3] + "K";
  }
  if (temp.length > 6 && temp.length < 10) {
    let toKeep = temp.length - 6;
    return temp.slice(0, toKeep) + "M";
  }
  if (temp.length > 9 && temp.length < 13) {
    let toKeep = temp.length - 9;
    return temp.slice(0, toKeep) + "B";
  }
  if (temp.length > 12 && temp.length) {
    let toKeep = temp.length - 12;
    return temp.slice(0, toKeep) + "T";
  }

  return str;
};
