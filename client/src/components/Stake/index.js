import React, { useState, useContext } from "react";
import Pool from "../Farm/Pool";
import { FarmContainer, Title } from "./styles";
import CredentialsContext from "../../context/credentialsContext";

const Stake = () => {
  const [collapsed, setCollapsed] = useState({
    STRING: true,
    LQTY: true,
  });
  const {
    userBalances,
    farmBalances,
    userAllowances,
    profitShareBalances,
  } = useContext(CredentialsContext);

  return (
    <FarmContainer>
      <Title>STRING</Title>
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
        LPTokensStaked={profitShareBalances.userStaked.STRING}
        pendingTokens={profitShareBalances.userPending.STRING}
        stringTokensAllowance={userAllowances.profitShare.STRING}
        collapse={() => {
          setCollapsed({ ...collapsed, STRING: true });
        }}
        expand={() => {
          setCollapsed({ ...collapsed, STRING: false });
        }}
      />
      <Title>LQTY</Title>
      <Pool
        noClaim
        from={"Rewards"}
        src={""}
        currency1={"LQTY"}
        currencyLP={"LQTY"}
        currencyEarned={["LUSD", "ETH"]}
        collapsed={collapsed.LQTY}
        LPTokensInWallet={userBalances.LQTY}
        LPTokensAllowance={userAllowances.profitShare.LQTY}
        LPTokensStaked={farmBalances.userStaked.LQTY}
        pendingTokens={farmBalances.userPending.LQTY}
        stringTokensAllowance={userAllowances.profitShare.STRING}
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
