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
  PairLogoContainer,
  LogoContainer,
  PairLogo,
} from "./styles";
import Modal from "../../Modal";
import CredentialsContext from "../../../context/credentialsContext";
import { fromWei, toWei } from "../../../utils/truncateString";
import ethLogo from "../../../assets/eth1.png";
import stringLogo from "../../../assets/string1.png";
import liquityLogo from "../../../assets/liq.svg";
import uniswapLogo from "../../../assets/uniswap2.svg";

const Pool = ({
  noClaim,
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
  from,
  src,
  conditionalMargin,
  currencyLP,
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

  const logosMap = {
    LUSD: liquityLogo,
    LQTY: liquityLogo,
    STRING: stringLogo,
    gSTRING: stringLogo,
    ETH: ethLogo,
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

  // debugger;

  const margin = conditionalMargin ? (collapsed ? "0px" : "10px") : "35.5px";

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
      <div style={{ marginTop: "12.5px", marginBottom: margin }}>
        <PoolContainer>
          <PairContainer>
            <ContractLink>
              <DEX>{from}</DEX>
              <Pair>{currency2 ? `${currency1}/${currency2}` : currency1}</Pair>
              <PairLogoContainer>
                <LogoContainer>
                  {/* <div> */}
                  {currency2 ? (
                    <>
                      <PairLogo src={logosMap[currency1]} />
                      <PairLogo src={logosMap[currency2]} />
                    </>
                  ) : (
                    <PairLogo src={logosMap[currency1]} />
                  )}
                  {/* </div> */}
                </LogoContainer>
              </PairLogoContainer>
            </ContractLink>
          </PairContainer>
          <EarnContainer>
            <EarnLabel>Recieve</EarnLabel>
            <div>
              {typeof currencyEarned === "string" ? (
                <Earned>
                  <img
                    style={{ width: "20px", height: "20px" }}
                    src={logosMap[currencyEarned]}
                  />
                  <span style={{ marginLeft: "-2.5px" }}>{currencyEarned}</span>
                </Earned>
              ) : (
                currencyEarned.map((c) => {
                  return (
                    <Earned style={{ marginBottom: "7px" }}>
                      <img
                        style={{
                          width: "12px",
                          height: "12px",
                          marginLeft: "4px",
                        }}
                        src={logosMap[c]}
                      />
                      <span style={{ marginLeft: "4px" }}>{c}</span>
                    </Earned>
                  );
                })
              )}
            </div>
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
        <UserInfoContainer collapsed={collapsed} noClaim={noClaim}>
          <UserInfoSubContainer>
            <InfoContainer>
              <InfoDesc>Staked</InfoDesc>
              <InfoBalance>
                {LPTokensStaked ? LPTokensStaked : 0} {currencyLP}
              </InfoBalance>
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
              <InfoBalance>
                {LPTokensInWallet ? LPTokensInWallet : 0} {currencyLP}
              </InfoBalance>
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

          {!noClaim && (
            <UserInfoSubContainer>
              <InfoContainer>
                <InfoDesc>Recieved</InfoDesc>
                <InfoBalance>
                  {pendingTokens ? pendingTokens : 0} STRING
                </InfoBalance>
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
          )}
        </UserInfoContainer>
      </div>
    </>
  );
};

export default Pool;
