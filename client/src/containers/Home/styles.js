import styled from "styled-components";
import MasterStyles from "../../utils/masterStyles";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;

  // background: -webkit-linear-gradient(
  //   31deg,
  //   rgb(204, 149, 255),
  //   rgb(243, 241, 244)
  // );
  // background: linear-gradient(31deg, rgb(204, 149, 255), rgb(243, 241, 244));

  background: -webkit-linear-gradient(
    -180deg,
    rgb(227, 193, 255),
    rgb(244, 244, 244)
  );
  background: linear-gradient(-180deg, rgb(227, 193, 255), rgb(244, 244, 244));

  display: flex;
  justify-content: center;
  // flex-direction: row;
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
  max-width: 705px;
  min-height: 205px;
  border: 3px solid black;
  padding: 10px 25px 0px 25px;
  background-color: ${MasterStyles.background.menu};
  margin-top: 25px;
  margin-bottom: 25px;
  position: relative;
`;

export const AppContainer = styled.div`
  max-width: 705px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

export const ConnectionContainer = styled.div`
  position: absolute;
  right: 0px;
  bottom: -27px;
  display: flex;
  flex-direction: row;
  align-items: center;

  // width: 300px;
`;

export const ConnectStatus = styled.span`
  font-size: ${MasterStyles.fontSize.small};
  margin-left: 5px;
`;

export const ConnectedCircle = styled.div`
  height: 7px;
  width: 7px;
  border-radius: 50%;
  background-color: #25e472;
  margin-left: 5px;
`;

export const NotConnectedCircle = styled.div`
  height: 7px;
  width: 7px;
  border-radius: 50%;
  background-color: #e42659;
  margin-left: 5px;
`;

export const AddressContainer = styled.div`
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0.16, rgb(207, 207, 207)),
    color-stop(0.79, rgb(252, 252, 252))
  );
  background-image: -moz-linear-gradient(
    center bottom,
    rgb(207, 207, 207) 16%,
    rgb(252, 252, 252) 79%
  );
  background-image: linear-gradient(
    to top,
    rgb(207, 207, 207) 16%,
    rgb(252, 252, 252) 79%
  );
  padding: 3px;
  outline: none;
  border: 1px solid #000;
  color: black;
  font-size: ${MasterStyles.fontSize.small};
  background-color: #fcfcfc !important;
  width: 90px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HR = styled.div`
  margin-top: 20px;
  border-top: 5px dashed black;
  height: 0px;
  width: 100%;
`;
