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
  Parent,
  Network,
  NetworkContainer,
} from "./styles";
import Logo from "../../assets/harp.png";
import Menu from "../../components/Menu";
import Content from "../Content";
import CredentialsContext from "../../context/credentialsContext";
import { truncateAddress } from "../../utils/truncateString";
import SmallScreen from "../../components/SmallScreen";

const Home = () => {
  const { isConnected, address, loading, network } = useContext(
    CredentialsContext
  );

  const connectionStatus = isConnected ? (
    <ConnectionContainer>
      {network && (
        <NetworkContainer network={network}>
          <Network>
            {network.charAt(0).toUpperCase() + network.slice(1)}
          </Network>
        </NetworkContainer>
      )}
      <AddressContainer
        target="_blank"
        href={network && `https://${network}.etherscan.io/address/${address}`}
      >
        <i>{truncateAddress(address)}</i>
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
      <SmallScreen />
      <Parent>
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
      </Parent>
    </Container>
  );
};

export default Home;
