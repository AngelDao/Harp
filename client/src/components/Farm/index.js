import React, { useState, useContext } from "react";
import Pool from "./Pool";
import { FarmContainer, Title } from "./styles";
import CredentialsContext from "../../context/credentialsContext";

const Farm = () => {
  const [collapsed, setCollapsed] = useState({
    stringETH: true,
    stringLUSD: true,
    LUSD: true,
  });
  const { userBalances, farmBalances, userAllowances } = useContext(
    CredentialsContext
  );

  return (
    <FarmContainer>
      <Title>Liquity Pools</Title>
      <Pool
        conditionalMargin
        from={"Stability"}
        src={""}
        currency1={"LUSD"}
        currencyLP={"LUSD"}
        currencyEarned={["STRING", "ETH", "LQTY"]}
        collapsed={collapsed.LUSD}
        LPTokensInWallet={userBalances.LUSD}
        LPTokensAllowance={userAllowances.LUSD}
        LPTokensStaked={farmBalances.userStaked.LUSD}
        pendingTokens={farmBalances.userPending.LUSD}
        stringTokensAllowance={userAllowances.STRING}
        collapse={() => {
          setCollapsed({ ...collapsed, LUSD: true });
        }}
        expand={() => {
          setCollapsed({ ...collapsed, LUSD: false });
        }}
      />
      <Title>STRING Pools</Title>
      <Pool
        from={"Uniswap"}
        src={""}
        currency1={"STRING"}
        currency2={"ETH"}
        currencyLP={"UNI LP"}
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
        from={"Uniswap"}
        src={""}
        currency1={"STRING"}
        currency2={"LUSD"}
        currencyLP={"UNI LP"}
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
