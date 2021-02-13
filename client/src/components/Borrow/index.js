import React, { useState, useContext } from "react";
import Trove from "./Trove";
import Details from "./Details";
import { BorrowContainer, Title, TroveContainer } from "./styles";
import CredentialsContext from "../../context/credentialsContext";

const Borrow = () => {
  const { web3DataProvider, farmBalances, prices } = useContext(
    CredentialsContext
  );

  const web3 = web3DataProvider;

  return (
    <BorrowContainer>
      <Title>My Trove</Title>
      <TroveContainer>
        <Trove />
        <Details />
      </TroveContainer>
    </BorrowContainer>
  );
};

export default Borrow;
