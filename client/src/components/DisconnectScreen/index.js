import React, { useState, useEffect, useContext } from "react";
import { ComponentContainer, StyledButton } from "./styles";
import CredentialsContext from "../../context/credentialsContext";

const DisconnectScreen = () => {
  const { handleManualConnect, setAddress } = useContext(CredentialsContext);

  const handleClick = async () => {
    try {
      setAddress(0);
      await handleManualConnect();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <ComponentContainer>
        <StyledButton onClick={handleClick}>
          <i>Connect Wallet</i>
        </StyledButton>
      </ComponentContainer>
    </>
  );
};

export default DisconnectScreen;
