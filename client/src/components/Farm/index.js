import React, { useState } from "react";
import Pool from "./Pool";
import { FarmContainer, Title } from "./styles";

const Farm = () => {
  const [collapsed, setCollapsed] = useState({
    stringETH: true,
    stringLUSD: true,
  });

  return (
    <FarmContainer>
      <Title>Pools</Title>
      <Pool
        currency1={"STRING"}
        currency2={"ETH"}
        currencyEarned={"STRING"}
        collapsed={collapsed.stringETH}
        collapse={() => {
          setCollapsed({ ...collapsed, stringETH: true });
        }}
        expand={() => {
          setCollapsed({ ...collapsed, stringETH: false });
        }}
      />
      <Pool
        currency1={"STRING"}
        currency2={"LUSD"}
        currencyEarned={"STRING"}
        collapsed={collapsed.stringLUSD}
        collapse={() => {
          setCollapsed({ ...collapsed, stringLUSD: true });
        }}
        expand={() => {
          setCollapsed({ ...collapsed, stringLUSD: false });
        }}
      />
    </FarmContainer>
  );
};

export default Farm;
