import styled from "styled-components";
import MasterStyles from "../../utils/masterStyles";

export const ConnectContainer = styled.div`
  width: 100%;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const StyledText = styled.textarea`
  font-size: 15px;
  height: 350px;
  width: 500px;
  white-space: normal;
  resize: none;
  text-align: justify;
  background-color: ${MasterStyles.background.app};
  outline: none;
  border: none;
  // -moz-text-align-last: center;
  // text-align-last: center;
`;

export const ComponentContainer = styled.div`
  display: flex;
  justify-content: center;
  min-height: 50%;
  flex-direction: column;
  align-items: center;
`;

export const ConnectText = styled.span`
  font-style: italic;
  text-align: center;
`;

export const StyledButton = styled.button`
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
  font-size: ${MasterStyles.fontSize.large};
  background-color: #fcfcfc !important;
  width: 160px;
  height: 40px;
`;
