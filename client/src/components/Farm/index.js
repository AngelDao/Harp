import React, { useState, useContext } from "react";
import Pool from "./Pool";
import { FarmContainer, Title, Audit, AuditContainer } from "./styles";
import CredentialsContext from "../../context/credentialsContext";

const Farm = () => {
  const [collapsed, setCollapsed] = useState({
    stringETH: true,
    stringLUSD: true,
    LUSD: true,
  });
  const {
    userBalances,
    farmBalances,
    userAllowances,
    proxyBalances,
  } = useContext(CredentialsContext);

  return (
    <FarmContainer>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Title>Incentivized Pools</Title>
        <AuditContainer style={{ marginLeft: "25px" }}>
          <Audit>UNAUDITED, use at your own risk</Audit>
        </AuditContainer>
      </div>
      <Pool
        conditionalMargin
        contract={"factory"}
        from={"Stability (Proxy)"}
        src={""}
        currency1={"LUSD"}
        currencyLP={"LUSD"}
        currencyEarned={["STRING", "ETH", "LQTY"]}
        collapsed={collapsed.LUSD}
        LPTokensInWallet={userBalances.LUSD}
        LPTokensAllowance={userAllowances.proxy.LUSD}
        LPTokensStaked={proxyBalances.userStaked.LUSD}
        pendingTokens={proxyBalances.userPending.STRING}
        secondPendingTokens={proxyBalances.userPending.ETH}
        thirdPendingTokens={proxyBalances.userPending.LQTY}
        stringTokensAllowance={userAllowances.farm.STRING}
        collapse={() => {
          setCollapsed({ ...collapsed, LUSD: true });
        }}
        expand={() => {
          setCollapsed({ ...collapsed, LUSD: false });
        }}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Title>gSTRING Pools</Title>
        <AuditContainer style={{ marginLeft: "25px" }}>
          <Audit>UNAUDITED, use at your own risk</Audit>
        </AuditContainer>
      </div>
      <Pool
        from={"Uniswap"}
        contract={"farm"}
        src={""}
        currency1={"gSTRING"}
        currency2={"ETH"}
        currencyLP={"UNI LP"}
        currencyEarned={["STRING"]}
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
        currencyEarned={["STRING"]}
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
