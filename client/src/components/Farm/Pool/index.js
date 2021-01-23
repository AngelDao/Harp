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
  stringTokens,
}) => {
  const { web3DataProvider } = useContext(CredentialsContext);

  const web3 = web3DataProvider;

  const viewButton = !collapsed ? (
    <CollapseButton onClick={collapse}>Collapse ↑</CollapseButton>
  ) : (
    <CollapseButton onClick={expand}>Expand ↓</CollapseButton>
  );

  return (
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
            <InfoBalance>{fromWei(web3, LPTokensStaked)} UNI LP</InfoBalance>
          </InfoContainer>
          <ActionButtonContainer>
            <ActionButton>
              <i>Withdraw</i>
            </ActionButton>
          </ActionButtonContainer>
        </UserInfoSubContainer>

        <UserInfoSubContainer>
          <InfoContainer>
            <InfoDesc>Wallet</InfoDesc>
            <InfoBalance>{fromWei(web3, LPTokensInWallet)} UNI LP</InfoBalance>
          </InfoContainer>
          <ActionButtonContainer>
            <ActionButton>
              <i>Deposit</i>
            </ActionButton>
          </ActionButtonContainer>
        </UserInfoSubContainer>

        <UserInfoSubContainer>
          <InfoContainer>
            <InfoDesc>Recieved</InfoDesc>
            <InfoBalance>{fromWei(web3, stringTokens)} STRING</InfoBalance>
          </InfoContainer>
          <ActionButtonContainer>
            <ActionButton>
              <i>Claim</i>
            </ActionButton>
          </ActionButtonContainer>
        </UserInfoSubContainer>
      </UserInfoContainer>
    </div>
  );
};

export default Pool;
