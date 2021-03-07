import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  StyledLogo,
  InnerContainer,
  LogoContainer,
  AppContainer,
  ConnectStatus,
  ConnectionContainer,
  NotConnectedCircle,
  ConnectedCircle,
  AddressContainer,
  HR,
} from "./styles";
import Logo from "../../assets/harpLogo.png";
import Menu from "../../components/Menu";
import Content from "../Content";
import CredentialsContext from "../../context/credentialsContext";
import { truncateAddress } from "../../utils/truncateString";

const Home = () => {
  const { isConnected, address, loading } = useContext(CredentialsContext);

  const connectionStatus = isConnected ? (
    <ConnectionContainer>
      <AddressContainer>
        <span>
          <i>{truncateAddress(address)}</i>
        </span>
      </AddressContainer>
      <ConnectStatus>Connected</ConnectStatus>
      <ConnectedCircle />
    </ConnectionContainer>
  ) : (
    <ConnectionContainer>
      <ConnectStatus>Not Connected</ConnectStatus>
      <NotConnectedCircle />
    </ConnectionContainer>
  );

  return (
    <Container>
      <AppContainer>
        <InnerContainer>
          <LogoContainer>
            <StyledLogo src={Logo} />
          </LogoContainer>
          <Menu />
          <HR />
          {connectionStatus}
          {/* side scrolling banner */}
          {/* <div
            style={{
              width: "510px",
              height: 17.5,
              backgroundColor: "#fdff77",
              position: "absolute",
              bottom: "-25.75px",
              left: "-3px",
              border: "dashed black 2px",
            }}
          ></div> */}
        </InnerContainer>
        <Content loading={loading} />
      </AppContainer>
    </Container>
  );
};

export default Home;
