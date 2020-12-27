import React from "react";
import { Container, StyledLogo, InnerContainer, LogoContainer } from "./styles";
import Logo from "../../assets/harpLogo.png";
import Menu from "../../components/Menu";
import Content from "../Content";

const Home = () => {
  return (
    <Container>
      <InnerContainer>
        <LogoContainer>
          <StyledLogo src={Logo} />
        </LogoContainer>
        <Menu />
        <div style={{ marginTop: "20px" }}>
          <hr style={{ border: " 3.5px dashed black", marginTop: "15px" }} />
        </div>
        <Content loading />
      </InnerContainer>
    </Container>
  );
};

export default Home;
