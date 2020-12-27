import React, { useEffect, useState } from "react";
import { MenuContainer, Item, EffectContainer, ItemContainer } from "./styles";

const Menu = () => {
  const [current, setCurrent] = useState("borrow");
  const [currentH, setCurrentH] = useState(null);

  const handleClick = (c) => {
    setCurrent(c);
  };

  const handleHover = (c) => {
    setCurrentH(c);
  };

  return (
    <MenuContainer>
      <EffectContainer>
        <ItemContainer>
          <Item
            onMouseLeave={() => handleHover("")}
            onMouseOver={() => handleHover("borrow")}
            onClick={() => handleClick("borrow")}
            current={current === "borrow"}
            hover={currentH === "borrow"}
          >
            Borrow
          </Item>
          <Item
            onMouseLeave={() => handleHover("")}
            onMouseOver={() => handleHover("farm")}
            onClick={() => handleClick("farm")}
            current={current === "farm"}
            hover={currentH === "farm"}
          >
            Farm
          </Item>
          <Item
            onMouseLeave={() => handleHover("")}
            onMouseOver={() => handleHover("stake")}
            onClick={() => handleClick("stake")}
            current={current === "stake"}
            hover={currentH === "stake"}
          >
            Stake
          </Item>
          <Item
            onMouseLeave={() => handleHover("")}
            onMouseOver={() => handleHover("faq")}
            onClick={() => handleClick("faq")}
            current={current === "faq"}
            hover={currentH === "faq"}
          >
            FAQ
          </Item>
        </ItemContainer>
      </EffectContainer>
    </MenuContainer>
  );
};

export default Menu;
