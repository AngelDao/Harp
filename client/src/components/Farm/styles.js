import styled from "styled-components";
import MasterStyles from "../../utils/masterStyles";

export const FarmContainer = styled.div`
  margin-top: 10px;
`;

export const Title = styled.div`
font-size ${MasterStyles.fontSize.veryLarge};
// margin-bottom: 12.5px;
`;

export const AuditContainer = styled.div`
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  background-image: ${() => {
    const color = "#ffc20b";
    return `-webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0.16, ${color}),
    color-stop(0.79, ${color})
  )`;
  }};
  background-image: ${() => {
    const color = "#ffc20b";
    return `-moz-linear-gradient(
      center bottom,
      ${color} 16%,
      ${color} 79%
    )`;
  }};
  background-image: ${() => {
    const color = "#ffc20b";
    return `linear-gradient(to top, ${color} 16%, ${color} 79%)`;
  }};
  padding: 3px;
  outline: none;
  border: 1px solid #000;
  color: black;
  font-size: ${MasterStyles.fontSize.small};
  background-color: "#fcfcfc !important";
  width: 200px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: italic;
  margin-right: 7.5px;
`;

export const Audit = styled.span`
  font-size: ${MasterStyles.fontSize.small};
  padding: 1px;
`;
