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
  const { isConnected, address } = useContext(CredentialsContext);
  const [loading, setLoading] = useState(false);

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
        </InnerContainer>
        <Content loading={loading} />
      </AppContainer>
    </Container>
  );
};

export default Home;
