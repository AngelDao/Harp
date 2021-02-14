import styled from "styled-components";
import MasterStyles from "../../../utils/masterStyles";

export const TroveFormContainer = styled.div`
  width: 100%;
  height: 100%;
  background: ${MasterStyles.background.menu};
  border: 3px solid black;
  padding: 10px 25px 10px 25px;
  margin-bottom: 35.5px;
  flex-direction: column;
`;

export const TroveRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const RowKey = styled.div`
  display: flex,
  justify-content: space-between,
  margin-top: 10px,
`;

export const CollapseButton = styled.a`
  font-size: ${MasterStyles.fontSize.small};
  cursor: pointer;

  text-decoration: underline;
  :hover {
    text-decoration: underline;
  }
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

export const ActionButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  margin-top: 12.5px;
`;
