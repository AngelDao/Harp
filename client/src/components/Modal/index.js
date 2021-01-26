import React, { useState, useContext } from "react";
import CredentialsContext from "../../context/credentialsContext";
import ActionsModal from "./ActionModal";
import ClaimModal from "./ClaimModal";

const Modal = ({ open, close, type, balance, allowance, pair }) => {
  const {
    contracts: { farm, stringToken, ETHLPToken, LUSDLPToken },
    address,
    setUserAllowances,
    userAllowances,
    web3DataProvider,
    web3UserProvider,
    reFetchData,
  } = useContext(CredentialsContext);

  if (type === "Deposit" || type === "Withdraw") {
    return (
      <ActionsModal
        open={open}
        close={close}
        type={type}
        balance={balance}
        allowance={allowance}
        pair={pair}
      />
    );
  } else if (type === "Claim") {
    return (
      <ClaimModal open={open} close={close} balance={balance} pair={pair} />
    );
  }
  return null;
};

export default Modal;
