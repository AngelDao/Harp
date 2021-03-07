import styled from "styled-components";
import MasterStyles from "../../utils/masterStyles";

export const LoadingContainer = styled.div`
  width: 100%;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const StyledText = styled.textarea`
  font-size: ${({ fs }) => fs};
  height: ${({ h }) => h};
  width: ${({ w }) => w};
  white-space: normal;
  resize: none;
  text-align: justify;
  background: transparent;
  // color: transparent;
  outline: none;
  border: none;
  rows: 6;
  cols: 25;
  font-family: monospace !important;
  // -moz-text-align-last: center;
  // text-align-last: center;
`;

export const ComponentContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

export const LoadingText = styled.span`
  font-size: ${MasterStyles.fontSize.veryLarge};
  font-style: italic;
  text-align: center;
`;
