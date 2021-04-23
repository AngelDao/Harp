import styled from "styled-components";
import MasterStyles from "../../utils/masterStyles";
import { NavLink } from "react-router-dom";

export const StyledLink = styled(NavLink)`
  text-decoration: none;
  cursor: pointer;
`;

export const MenuContainer = styled.div`
  width: 100%;
  min-height: 45px;
  // border: 3.5px solid black;
  // margin-top: -105px;
  position: relative;
  flex-direction: row;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const EffectContainer = styled.div`
  width: 100%;
  min-height: 45px;
  display: flex;
  justify-content: space-around;
  border: 3.5px solid black;
  align-items: center;
`;

export const ItemContainer = styled.div`
  width: 100%;
  min-height: 45px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
`;

export const Item = styled.div`
  font-size: ${MasterStyles.fontSize.veryLarge};
  color: ${({ current, hover }) =>
    current ? "#fcff00" : hover ? "white" : "black"};
  border-top: ${({ current, hover }) =>
    current || hover ? "3.5px solid" : "none"};
  border-bottom: ${({ current, hover }) =>
    current || hover ? "3.5px solid" : "none"};
  padding: 3.05px;
  cursor: pointer;
  line-height: normal;
`;
