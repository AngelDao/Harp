import styled from "styled-components";
import MasterStyles from "../../utils/masterStyles";

export const CloseContainer = styled.div`
  height: 100%;
  position: absolute;
  display: flex;
  top: 0px;
  right: 16px;
  width: 33px;
  justify-content: center;
  align-items: center;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const CollapseButton = styled.a`
  font-size: ${MasterStyles.fontSize.small};
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`;

// export const ActionButton = styled.button`
//   display: inline-block;
//   margin-left: 9px;
//   padding: 4px 6px;
//   width: 50%;
//   font-size: ${MasterStyles.fontSize.medium};
//   line-height: 20px;
//   color: black;
//   text-align: center;
//   background: #cabed5;
//   vertical-align: middle;
//   border: 2px solid black;

//   :hover {
//     background: #a895ba;
//   }
// `;

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
    color-stop(0.16, ${action ? "rgb(207, 207, 207)" : "#b8b8b8"}),
    color-stop(0.79, ${action ? "rgb(252, 252, 252)" : "#b8b8b8"}));`;
  }}
  background-image: ${({ action }) => {
    return `-moz-linear-gradient(
    center bottom,
    ${action ? "rgb(207, 207, 207)" : "#b8b8b8"} 16%,
    ${action ? "rgb(252, 252, 252)" : "#b8b8b8"} 79%
  );`;
  }}
  background-image: ${({ action }) => {
    return `linear-gradient(to top, ${
      action ? "rgb(207, 207, 207)" : "#b8b8b8"
    } 16%, ${action ? "rgb(252, 252, 252)" : "#b8b8b8"} 79%);`;
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
`;

export const NotConnectedCircle = styled.div`
  height: 7px;
  width: 7px;
  border-radius: 50%;
  background-color: #e42659;
  margin-right: 5px;
`;

export const ConnectedCircle = styled.div`
  height: 7px;
  width: 7px;
  border-radius: 50%;
  background-color: #25e472;
  margin-right: 5px;
`;

export const AllowanceContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  align-items: center;
`;

export const AllowanceText = styled.span`
  font-size: ${MasterStyles.fontSize.small};
`;

export const ActionContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

// `"Error: [ethjs-query] while formatting outputs from RPC '{"value":{"code":-32603,"data":{"message":"VM Exception while processing transaction: invalid opcode","code":-32000,"data":{"0x41a306067b99d3e79a115253eb78f8724d660ef037ef448f9bf15675791cc6e4":{"error":"invalid opcode","program_counter":5919,"return":"0x"},"stack":"RuntimeError: VM Exception while processing transaction: invalid opcode\n    at Function.RuntimeError.fromResults (C:\\Program Files\\WindowsApps\\GanacheUI_2.5.4.0_x64__5dg5pnz03psnj\\app\\resources\\static\\node\\node_modules\\ganache-core\\lib\\utils\\runtimeerror.js:94:13)\n    at BlockchainDouble.processBlock (C:\\Program Files\\WindowsApps\\GanacheUI_2.5.4.0_x64__5dg5pnz03psnj\\app\\resources\\static\\node\\node_modules\\ganache-core\\lib\\blockchain_double.js:627:24)\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)","name":"RuntimeError"}}}}'"`;
