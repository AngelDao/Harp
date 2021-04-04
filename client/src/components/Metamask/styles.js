import styled from "styled-components";
import MasterStyles from "../../utils/masterStyles";

export const Link = styled.a`
  text-decoration: underline;
  color: rgb(0, 0, 238);
`;

export const Message = styled.div`
    display: flex;
    justify-content: center;
    padding-top: 100px;
    font-size: ${MasterStyles.fontSize.large};
    align-items: center;
`;