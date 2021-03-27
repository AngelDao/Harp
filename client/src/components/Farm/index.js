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
  const { userBalances, farmBalances, userAllowances, proxyBalances } = useContext(
    CredentialsContext
  );

  return (
    <FarmContainer>
      <Title>Liquity Pools</Title>
      <Pool
        conditionalMargin
        contract={"factory"}
        from={"Stability"}
        src={""}
        currency1={"LUSD"}
        currencyLP={"LUSD"}
        currencyEarned={["STRING", "ETH", "LQTY"]}
        collapsed={collapsed.LUSD}
        LPTokensInWallet={userBalances.LUSD}
        LPTokensAllowance={userAllowances.proxy.LUSD}
        LPTokensStaked={proxyBalances.userStaked.LUSD}
        pendingTokens={proxyBalances.userPending.LUSD}
        stringTokensAllowance={userAllowances.farm.STRING}
        collapse={() => {
          setCollapsed({ ...collapsed, LUSD: true });
        }}
        expand={() => {
          setCollapsed({ ...collapsed, LUSD: false });
        }}
      />
      <Title>gSTRING Pools</Title>
      <Pool
        from={"Uniswap"}
        contract={"farm"}
        src={""}
        currency1={"gSTRING"}
        currency2={"ETH"}
        currencyLP={"UNI LP"}
        currencyEarned={"STRING"}
        collapsed={collapsed.stringETH}
        LPTokensInWallet={userBalances.gSTRING_ETH_LP}
        LPTokensAllowance={userAllowances.farm.gSTRING_ETH_LP}
        LPTokensStaked={farmBalances.userStaked.gSTRING_ETH_LP}
        pendingTokens={farmBalances.userPending.gSTRING_ETH_LP}
        stringTokensAllowance={userAllowances.farm.STRING}
        collapse={() => {
          setCollapsed({ ...collapsed, stringETH: true });
        }}
        expand={() => {
          setCollapsed({ ...collapsed, stringETH: false });
        }}
      />
      <Pool
        from={"Uniswap"}
        contract={"farm"}
        src={""}
        currency1={"gSTRING"}
        currency2={"LUSD"}
        currencyLP={"UNI LP"}
        currencyEarned={"STRING"}
        collapsed={collapsed.stringLUSD}
        LPTokensInWallet={userBalances.gSTRING_LUSD_LP}
        LPTokensAllowance={userAllowances.farm.gSTRING_LUSD_LP}
        LPTokensStaked={farmBalances.userStaked.gSTRING_LUSD_LP}
        pendingTokens={farmBalances.userPending.gSTRING_LUSD_LP}
        stringTokensAllowance={userAllowances.farm.STRING}
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
