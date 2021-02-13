import styled from "styled-components";
import MasterStyles from "../../../utils/masterStyles";

export const BorrowContainer = styled.div`
  margin-top: 0px;
`;

export const Title = styled.div`
font-size ${MasterStyles.fontSize.veryLarge};
margin-bottom: 12.5px;
`;

export const TroveContainer = styled.div`
  flex-direction: column;
`;

export const DescContainer = styled.div`
  width: 100%;
  height: auto;
  background: ${MasterStyles.background.menu};
  border: 3px solid black;
  padding: 15px 25px 15px 25px;
  display: flex;
  flex-direction: column;
`;

export const Desc = styled.span`
  font-size: ${MasterStyles.fontSize.medium};
  margin-top: 12.5px;
  margin-bottom: 12.5px;
`;

export const HR = styled.div`
  border-top: 5px dashed black;
  height: 0px;
  width: 100%;
`;
