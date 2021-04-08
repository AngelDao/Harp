import styled from "styled-components";
import MasterStyles from "../../utils/masterStyles";

export const DescContainer = styled.div`
  width: 100%;
  height: auto;
  background: ${MasterStyles.background.menu};
  border: 3px solid black;
  padding: 15px 25px 15px 25px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20.5px;
`;

export const Title = styled.div`
font-size ${MasterStyles.fontSize.veryLarge};
margin-bottom: 12.5px;
// marginTop: "12.5px", marginBottom: "35.5px"
`;
export const SubTitle = styled.div`
font-size ${MasterStyles.fontSize.large};
margin-bottom: 6px;
// marginTop: "12.5px", marginBottom: "35.5px"
`;

export const ActionButton = styled.button`
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  background-image: ${({ action }) => {
    return `-webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0.16, ${action ? "rgb(207, 207, 207)" : "rgb(93 93 93)"}),
    color-stop(0.79, ${action ? "rgb(252, 252, 252)" : "rgb(160 160 160)"}));`;
  }};
  background-image: ${({ action }) => {
    return `-moz-linear-gradient(
    center bottom,
    ${action ? "rgb(207, 207, 207)" : "rgb(93 93 93)"} 16%,
    ${action ? "rgb(252, 252, 252)" : "rgb(160 160 160)"} 79%
  );`;
  }}
  background-image: ${({ action }) => {
    return `linear-gradient(to top, ${
      action ? "rgb(207, 207, 207)" : "rgb(93 93 93)"
    } 16%, ${action ? "rgb(252, 252, 252)" : "rgb(160 160 160)"} 79%);`;
  }}
  padding: 3px;
  outline: none;
  border: 1px solid #000;
  color: black;
  font-size: ${MasterStyles.fontSize.medium};
  background-color: #fcfcfc !important;
  width: 100px;
  height: 33px;
  font-style: italic;
  cursor: ${({ disabled }) => {
    return disabled ? "not-allowed" : "cursor";
  }};
`;

export const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  // justify-content: space-between;
`;

export const AssetCell = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
`;

export const ContentRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 0 px 0px;
`;

export const HeaderTitle = styled.span`
  font-size: ${MasterStyles.fontSize.medium};
`;

export const Cell = styled.div`
  width: 70px;
`;

export const WrapperCenter = styled.div`
  width: 100%;
  display: flex;
  // justify-content: center;
`;

export const HR = styled.div`
  margin-top: 5px;
  border-top: 2.5px dashed black;
  height: 0px;
  width: 100%;
`;
