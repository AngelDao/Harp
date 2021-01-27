import styled from "styled-components";
import MasterStyles from "../../../utils/masterStyles";

export const PoolContainer = styled.div`
  width: 100%;
  height: 140px;
  background: ${MasterStyles.background.menu};
  border: 3px solid black;
  padding: 10px 25px 10px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const InfoContainer = styled.div`
  width: 100%;
  height: 80px;
  background: ${MasterStyles.background.secondaryMenu};
  border: 3px solid black;
  padding: 10px 10px 10px 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const UserInfoContainer = styled.div`
  display: flex;
  margin-top: 6.25px;
  justify-content: space-between;
  max-height: ${({ collapsed }) => (collapsed ? "0px" : "200px")};
  transition: max-height 0.4s linear;
  overflow: hidden;
`;

export const UserInfoSubContainer = styled.div`
  display: flex;
  width: 220px;
  flex-direction: column;
`;

export const PairContainer = styled.div`
  width: 100px;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const EarnContainer = styled.div`
  width: 100px;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DescContainer = styled.div`
  width: 100px;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const StatContainer = styled.div`
  width: 100px;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const ContractLink = styled.a`
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const DEX = styled.span`
  text-align: center;
  font-size: ${MasterStyles.fontSize.large};
`;

export const Pair = styled.span`
  text-align: center;
  font-size: ${MasterStyles.fontSize.medium};
`;

export const EarnLabel = styled.span`
  font-size: ${MasterStyles.fontSize.medium};
`;

export const Earned = styled.span`
  display: inline-block;
  margin-left: 9px;
  padding: 4px 6px;
  width: 65px;
  font-size: ${MasterStyles.fontSize.small};
  line-height: 20px;
  color: black;
  text-align: center;
  background: #e5c8ff;
  vertical-align: middle;
`;

export const Desc = styled.span`
font-size ${MasterStyles.fontSize.medium}
`;

export const Stat = styled.span`
font-size ${MasterStyles.fontSize.medium}
`;

export const CollapseButton = styled.a`
  font-size: ${MasterStyles.fontSize.small};
  cursor: pointer;

  text-decoration: underline;
  :hover {
    text-decoration: underline;
  }
`;

export const CollapseButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 6.25px;
`;

export const InfoDesc = styled.span`
  font-size: ${MasterStyles.fontSize.medium};
  font-weight: bold;
`;

export const InfoBalance = styled.span`
  font-size ${MasterStyles.fontSize.large};
`;

// rgb(93 93 93)
// rgb(93 93 93)
// rgb(160 160 160)
// rgb(160 160 160)
// original1 rgb(207, 207, 207)
// original2 rgb(252, 252, 252)
const action1 = "rgb(207, 207, 207)";
const action2 = "rgb(252, 252, 252)";
const cancel1 = "#b8b8b8";
const cancel2 = "#969696";
// green1 a2da84
// green2 e1eec7
// red1 e87d7b
// red2 f0a8a6
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
  }}
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

export const ActionButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 12.5px;
`;
