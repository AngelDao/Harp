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
  margin-bottom: 35.5px;
`;

export const Title = styled.div`
font-size ${MasterStyles.fontSize.veryLarge};
margin-bottom: 12.5px;
// marginTop: "12.5px", marginBottom: "35.5px"
`;

export const HR = styled.div`
  border-top: 5px dashed black;
  height: 0px;
  width: 100%;
`;

export const Desc = styled.span`
  font-size: ${MasterStyles.fontSize.medium};
  margin-top: 12.5px;
  margin-bottom: 12.5px;
`;

export const Link = styled.a`
  text-decoration: underline;
  color: rgb(0, 0, 238);
`;

export const TokenomicsList = styled.ul`
  padding-inline-start: 15px;

  li {
    display: list-item;
    text-align: -webkit-match-parent;
  }

  // li::before {
  //   content: "• \ \ \";
  //   display: table-cell; /* aha! */
  //   text-align: right;
  // }
`;
