import React, { useState, useContext } from "react";
import Pool from "./Pool";
import { FarmContainer, Title } from "./styles";
import CredentialsContext from "../../context/credentialsContext";

const Farm = () => {
  const [collapsed, setCollapsed] = useState({
    stringETH: true,
    stringLUSD: true,
  });
  const { userBalances, farmBalances, userAllowances } = useContext(
    CredentialsContext
  );

  return (
    <FarmContainer>
      <Title>Pools</Title>
      <Pool
        currency1={"STRING"}
        currency2={"ETH"}
        currencyEarned={"STRING"}
        collapsed={collapsed.stringETH}
        LPTokensInWallet={userBalances.STRING_ETH_LP}
        LPTokensAllowance={userAllowances.STRING_ETH_LP}
        LPTokensStaked={farmBalances.userStaked.STRING_ETH_LP}
        pendingTokens={farmBalances.userPending.STRING_ETH_LP}
        stringTokensAllowance={userAllowances.STRING}
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
        LPTokensInWallet={userBalances.STRING_LUSD_LP}
        LPTokensAllowance={userAllowances.STRING_LUSD_LP}
        LPTokensStaked={farmBalances.userStaked.STRING_LUSD_LP}
        pendingTokens={farmBalances.userPending.STRING_LUSD_LP}
        stringTokensAllowance={userAllowances.STRING}
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
