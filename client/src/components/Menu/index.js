import React, { useEffect, useState } from "react";
import { MenuContainer, Item, EffectContainer, ItemContainer } from "./styles";
import { StyledLink } from "./styles";
import { withRouter } from "react-router-dom";

const Menu = ({ location }) => {
  const [current, setCurrent] = useState(location.pathname.split("/")[1]);
  const [currentH, setCurrentH] = useState(null);

  const handleClick = (c) => {
    setCurrent(c);
  };

  const handleHover = (c) => {
    setCurrentH(c);
  };

  useEffect(() => {
    setCurrent(location.pathname.split("/")[1]);
  }, [location.pathname]);

  return (
    <MenuContainer>
      <EffectContainer>
        <ItemContainer>
          <StyledLink to="/stake">
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
          <StyledLink to="/farm">
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
          <StyledLink to="/borrow">
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
          <StyledLink to="/repay">
            <Item
              onMouseLeave={() => handleHover("")}
              onMouseOver={() => handleHover("repay")}
              onClick={() => handleClick("repay")}
              current={current === "repay"}
              hover={currentH === "repay"}
            >
              Repay
            </Item>
          </StyledLink>
          <StyledLink to="/faq">
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
