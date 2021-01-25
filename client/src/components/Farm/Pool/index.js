import React, { useState, useContext } from "react";
import {
  PoolContainer,
  PairContainer,
  ContractLink,
  DEX,
  Pair,
  EarnContainer,
  Earned,
  EarnLabel,
  DescContainer,
  Desc,
  StatContainer,
  Stat,
  CollapseButton,
  CollapseButtonContainer,
  InfoContainer,
  UserInfoContainer,
  InfoDesc,
  InfoBalance,
  ActionButton,
  ActionButtonContainer,
  UserInfoSubContainer,
} from "./styles";
import ActionsModal from "../../Modal";
import CredentialsContext from "../../../context/credentialsContext";
import { fromWei, toWei } from "../../../utils/truncateString";

const Pool = ({
  currency1,
  currency2,
  currencyEarned,
  collapsed,
  expand,
  collapse,
  LPTokensInWallet,
  LPTokensStaked,
  pendingTokens,
  LPTokensAllowance,
}) => {
  const { web3DataProvider } = useContext(CredentialsContext);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [balance, setBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);

  const web3 = web3DataProvider;

  const viewButton = !collapsed ? (
    <CollapseButton onClick={collapse}>Collapse ↑</CollapseButton>
  ) : (
    <CollapseButton onClick={expand}>Expand ↓</CollapseButton>
  );

  const handleOpen = (type, balance) => {
    setType(type);
    setOpen(true);
    setBalance(balance);
    setAllowance(LPTokensAllowance);
  };

  const handleClose = () => {
    setType("");
    setOpen(false);
    setBalance(0);
    setAllowance(0);
  };

  return (
    <>
      <ActionsModal
        open={open}
        close={handleClose}
        type={type}
        balance={balance && balance}
        allowance={allowance && allowance}
        pair={`${currency1}/${currency2}`}
      />
      <div style={{ marginTop: "12.5px", marginBottom: "35.5px" }}>
        <PoolContainer>
          <PairContainer>
            <ContractLink>
              <DEX>Uniswap</DEX>
              <Pair>
                {currency1}/{currency2}
              </Pair>
            </ContractLink>
          </PairContainer>
          <EarnContainer>
            <EarnLabel>Recieve</EarnLabel>
            <Earned>{currencyEarned}</Earned>
          </EarnContainer>
          <DescContainer>
            <Desc>Daily</Desc>
            <Desc>Weekly</Desc>
            <Desc>APY</Desc>
          </DescContainer>
          <StatContainer>
            <Stat>--%</Stat>
            <Stat>--%</Stat>
            <Stat>--%</Stat>
          </StatContainer>
        </PoolContainer>
        <CollapseButtonContainer>{viewButton}</CollapseButtonContainer>
        <UserInfoContainer collapsed={collapsed}>
          <UserInfoSubContainer>
            <InfoContainer>
              <InfoDesc>Staked</InfoDesc>
              <InfoBalance>{LPTokensStaked} UNI LP</InfoBalance>
            </InfoContainer>
            <ActionButtonContainer>
              <ActionButton
                onClick={() => {
                  handleOpen("Withdraw", LPTokensStaked);
                }}
              >
                <i>Withdraw</i>
              </ActionButton>
            </ActionButtonContainer>
          </UserInfoSubContainer>

          <UserInfoSubContainer>
            <InfoContainer>
              <InfoDesc>Wallet</InfoDesc>
              <InfoBalance>{LPTokensInWallet} UNI LP</InfoBalance>
            </InfoContainer>
            <ActionButtonContainer>
              <ActionButton
                onClick={() => {
                  handleOpen("Deposit", LPTokensInWallet);
                }}
              >
                <i>Deposit</i>
              </ActionButton>
            </ActionButtonContainer>
          </UserInfoSubContainer>

          <UserInfoSubContainer>
            <InfoContainer>
              <InfoDesc>Recieved</InfoDesc>
              <InfoBalance>{pendingTokens} STRING</InfoBalance>
            </InfoContainer>
            <ActionButtonContainer>
              <ActionButton
                onClick={() => {
                  handleOpen("Claim", pendingTokens);
                }}
              >
                <i>Claim</i>
              </ActionButton>
            </ActionButtonContainer>
          </UserInfoSubContainer>
        </UserInfoContainer>
      </div>
    </>
  );
};

export default Pool;
