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
import Modal from "../../Modal";
import CredentialsContext from "../../../context/credentialsContext";
import { fromWei, toWei } from "../../../utils/truncateString";
import ethLogo from "../../../assets/eth1.png";
import stringLogo from "../../../assets/string1.png";

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
  const { web3DataProvider, farmBalances, prices } = useContext(
    CredentialsContext
  );
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

  const makeBN = (n) => {
    return new web3DataProvider.utils.BN(n);
  };
  const pair = `${currency1}/${currency2}`;

  const pairNames = {
    "STRING/ETH": "STRING_ETH_LP",
    "STRING/LUSD": "STRING_LUSD_LP",
  };

  const alloc = {
    "STRING/ETH": 0.8,
    "STRING/LUSD": 0.2,
  };

  const pairTokensTVL =
    parseFloat(farmBalances.totalStaked[pairNames[pair]]) *
    parseFloat(prices[pairNames[pair]]);

  const rewardPerBlock = farmBalances.isBoosted
    ? 1.435897436 * 5 * alloc[pair]
    : 1.435897436 * alloc[pair];
  const blocksPerDay = 6500;
  // const year = 365;
  // const week = 7;

  const dailyUSDReturn = rewardPerBlock * blocksPerDay * prices.STRING;

  let dailyAPY, weeklyAPY, yearlyAPY;
  if (pairTokensTVL > 0) {
    dailyAPY = ((dailyUSDReturn / pairTokensTVL) * 100).toFixed(2);
    weeklyAPY = (((dailyUSDReturn * 7) / pairTokensTVL) * 100).toFixed(2);
    yearlyAPY = (((dailyUSDReturn * 365) / pairTokensTVL) * 100).toFixed(2);
  }

  return (
    <>
      <Modal
        open={open}
        close={handleClose}
        type={type}
        balance={balance && balance}
        allowance={allowance && allowance}
        pair={pair}
      />
      <div style={{ marginTop: "12.5px", marginBottom: "35.5px" }}>
        <PoolContainer>
          <PairContainer>
            <ContractLink>
              <DEX>Uniswap</DEX>
              <Pair>
                {currency1}/{currency2}
              </Pair>
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  width: "100px",
                  height: "30px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    style={{
                      width: "22px",
                      height: "22px",
                    }}
                    src={stringLogo}
                  />
                  <img
                    style={{
                      width: "22px",
                      height: "22px",
                    }}
                    src={ethLogo}
                  />
                </div>
              </div>
            </ContractLink>
          </PairContainer>
          <EarnContainer>
            <EarnLabel>Recieve</EarnLabel>
            <Earned>
              <img style={{ width: "20px", height: "20px" }} src={stringLogo} />
              <span style={{ marginLeft: "-2.5px" }}>{currencyEarned}</span>
            </Earned>
          </EarnContainer>
          <DescContainer>
            <Desc>Daily</Desc>
            <Desc>Weekly</Desc>
            <Desc>APY</Desc>
          </DescContainer>
          <StatContainer>
            <Stat>{dailyAPY ? dailyAPY : "--"}%</Stat>
            <Stat>{weeklyAPY ? weeklyAPY : "--"}%</Stat>
            <Stat>{yearlyAPY ? yearlyAPY : "--"}%</Stat>
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
                action={parseInt(LPTokensStaked) > 0}
                disabled={parseInt(LPTokensStaked) <= 0}
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
                action={parseInt(LPTokensInWallet) > 0}
                disabled={parseInt(LPTokensInWallet) <= 0}
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
                action={parseInt(pendingTokens) > 0}
                disabled={parseInt(pendingTokens) <= 0}
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
