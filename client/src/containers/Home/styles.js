import styled from "styled-components";
import MasterStyles from "../../utils/masterStyles";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${MasterStyles.background.app};
  display: flex;
  justify-content: center;
`;

export const LogoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const StyledLogo = styled.img`
  width: 85%;
  height: auto;
  margin-top: -100px;
`;

export const InnerContainer = styled.div`
  width: 740px;
  min-height: 100%;
`;
