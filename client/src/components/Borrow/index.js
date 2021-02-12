import React, { useState, useContext } from "react";
import Trove from "./Trove";
import { BorrowContainer, Title } from "./styles";
import CredentialsContext from "../../context/credentialsContext";

const Farm = () => {
  const { userBalances, farmBalances, userAllowances } = useContext(
    CredentialsContext
  );

  return (
    <BorrowContainer>
      <Title>My Trove</Title>
      <Trove />
    </BorrowContainer>
  );
};

export default Farm;
