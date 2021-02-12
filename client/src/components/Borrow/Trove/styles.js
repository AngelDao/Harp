import styled from "styled-components";
import MasterStyles from "../../../utils/masterStyles";

export const TroveContainer = styled.div`
  width: 100%;
  height: 100%;
  background: ${MasterStyles.background.menu};
  border: 3px solid black;
  padding: 10px 25px 10px 25px;
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
