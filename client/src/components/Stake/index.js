import React, { useState, useContext } from "react";
import Pool from "../Farm/Pool";
import { FarmContainer, Title, Audit, AuditContainer } from "./styles";
import CredentialsContext from "../../context/credentialsContext";

const Stake = () => {
  const [collapsed, setCollapsed] = useState({
    STRING: true,
    LQTY: true,
    LUSD: true,
  });
  const {
    userBalances,
    farmBalances,
    userAllowances,
    profitShareBalances,
    rewardsBalances,
    stabilityBalances,
  } = useContext(CredentialsContext);

  return (
    <FarmContainer>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Title contained>STRING</Title>
        <AuditContainer style={{ marginLeft: "25px" }}>
          <Audit>UNAUDITED, use at your own risk</Audit>
        </AuditContainer>
      </div>
      <Pool
        contract={"profitShare"}
        noClaim
        conditionalMargin
        from={"Profit Sharing"}
        src={""}
        currency1={"STRING"}
        currencyLP={"STRING"}
        currencyEarned={["STRING", "LQTY"]}
        collapsed={collapsed.STRING}
        LPTokensInWallet={userBalances.STRING}
        LPTokensAllowance={userAllowances.profitShare.STRING}
        gSTRINGAllowance={userAllowances.profitShare.gSTRING}
        LPTokensStaked={profitShareBalances.userStaked.STRING}
        pendingTokens={profitShareBalances.userPending.STRING}
        secondPendingTokens={profitShareBalances.userPending.LQTY}
        stringTokensAllowance={userAllowances.profitShare.STRING}
        collapse={() => {
          setCollapsed({ ...collapsed, STRING: true });
        }}
        expand={() => {
          setCollapsed({ ...collapsed, STRING: false });
        }}
      />
      <Title>LUSD</Title>
      <Pool
        from={"Stability"}
        contract={"stability"}
        src={""}
        conditionalMargin
        currency1={"LUSD"}
        currencyLP={"LUSD"}
        currencyEarned={["LQTY", "ETH"]}
        collapsed={collapsed.LUSD}
        LPTokensInWallet={userBalances.LUSD}
        LPTokensAllowance={userAllowances.stability.LUSD}
        LPTokensStaked={stabilityBalances.userStaked.LUSD}
        pendingTokens={stabilityBalances.userPending.LQTY}
        secondPendingTokens={stabilityBalances.userPending.ETH}
        collapse={() => {
          setCollapsed({ ...collapsed, LUSD: true });
        }}
        expand={() => {
          setCollapsed({ ...collapsed, LUSD: false });
        }}
      />
      <Title>LQTY</Title>
      <Pool
        from={"Rewards"}
        contract={"rewards"}
        src={""}
        currency1={"LQTY"}
        currencyLP={"LQTY"}
        currencyEarned={["LUSD", "ETH"]}
        collapsed={collapsed.LQTY}
        LPTokensInWallet={userBalances.LQTY}
        LPTokensAllowance={userAllowances.rewards.LQTY}
        LPTokensStaked={rewardsBalances.userStaked.LQTY}
        pendingTokens={rewardsBalances.userPending.LUSD}
        secondPendingTokens={rewardsBalances.userPending.ETH}
        collapse={() => {
          setCollapsed({ ...collapsed, LQTY: true });
        }}
        expand={() => {
          setCollapsed({ ...collapsed, LQTY: false });
        }}
      />
    </FarmContainer>
  );
};

export default Stake;
