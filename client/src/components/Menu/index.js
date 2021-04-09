import React, { useEffect, useState } from "react";
import { MenuContainer, Item, EffectContainer, ItemContainer } from "./styles";
import { StyledLink } from "./styles";
import { withRouter } from "react-router-dom";
import { pathFinder } from "../../utils/ipfsRouteHelper";

const Menu = ({ location, history }) => {
  const [current, setCurrent] = useState(location.pathname.split("/")[1]);
  const [currentH, setCurrentH] = useState(null);

  const handleClick = (c) => {
    setCurrent(c);
  };

  const handleHover = (c) => {
    // setCurrentH(c);
  };

  const pushToHistory = (route) => {
    debugger;
    history.push(route);
  };

  useEffect(() => {
    setCurrent(location.pathname.split("/")[1]);
  }, [location.pathname]);

  const ipfsHash = pathFinder();

  return (
    <MenuContainer>
      <EffectContainer>
        <ItemContainer>
          <StyledLink onClick={() => pushToHistory("stake")}>
            <Item
              onMouseLeave={() => handleHover("")}
              onMouseOver={() => handleHover("stake")}
              onClick={() => handleClick("stake")}
              current={current === "stake"}
              hover={currentH === "stake"}
            >
              Stake
            </Item>
          </StyledLink>
          <StyledLink onClick={() => pushToHistory("farm")}>
            <Item
              onMouseLeave={() => handleHover("")}
              onMouseOver={() => handleHover("farm")}
              onClick={() => handleClick("farm")}
              current={current === "farm"}
              hover={currentH === "farm"}
            >
              Farm
            </Item>
          </StyledLink>
          <StyledLink onClick={() => pushToHistory("borrow")}>
            <Item
              onMouseLeave={() => handleHover("")}
              onMouseOver={() => handleHover("borrow")}
              onClick={() => handleClick("borrow")}
              current={current === "borrow"}
              hover={currentH === "borrow"}
            >
              Borrow
            </Item>
          </StyledLink>
          <StyledLink onClick={() => pushToHistory("redeem")}>
            <Item
              onMouseLeave={() => handleHover("")}
              onMouseOver={() => handleHover("redeem")}
              onClick={() => handleClick("redeem")}
              current={current === "redeem"}
              hover={currentH === "redeem"}
            >
              Redeem
            </Item>
          </StyledLink>
          <StyledLink onClick={() => pushToHistory("faq")}>
            <Item
              onMouseLeave={() => handleHover("")}
              onMouseOver={() => handleHover("faq")}
              onClick={() => handleClick("faq")}
              current={current === "faq"}
              hover={currentH === "faq"}
            >
              FAQ
            </Item>
          </StyledLink>
        </ItemContainer>
      </EffectContainer>
    </MenuContainer>
  );
};

export default withRouter(Menu);
