import React, { useState, useEffect, useContext } from "react";
import { ComponentContainer, StyledButton } from "./styles";
import CredentialsContext from "../../context/credentialsContext";
import { addresses } from "../../utils/handleContracts/addresses";

const DisconnectScreen = () => {
  const { handleManualConnect, setAddress, address } = useContext(
    CredentialsContext
  );

  const handleClick = async () => {
    try {
      console.log("set new address after click");
      if (address) {
        setAddress("reconnect");
      } else {
        setAddress(0);
        handleManualConnect();
      }
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
