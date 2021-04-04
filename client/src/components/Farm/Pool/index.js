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
import { fromWei, toWei, readableTrunc } from "../../../utils/truncateString";
import ethLogo from "../../../assets/eth1.png";
import stringLogo from "../../../assets/string1.png";
import liquityLogo from "../../../assets/liq.svg";
import uniswapLogo from "../../../assets/uniswap2.svg";
import { addresses } from "../../../utils/handleContracts/addresses";
import Table from "./table";

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
  secondPendingTokens,
  thirdPendingTokens,
  LPTokensAllowance,
  gSTRINGAllowance,
  from,
  src,
  conditionalMargin,
  currencyLP,
  contract,
}) => {
  const {
    web3DataProvider,
    farmBalances,
    prices,
    profitShareBalances,
    factoryBalances,
    setSending,
    userBalances,
    tvl,
  } = useContext(CredentialsContext);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [balance, setBalance] = useState(0);
  const [balance2, setBalance2] = useState(false);
  const [balance3, setBalance3] = useState(false);
  const [allowance, setAllowance] = useState(0);

  const web3 = web3DataProvider;

  const viewButton = !collapsed ? (
    <CollapseButton onClick={collapse}>Collapse ↑</CollapseButton>
  ) : (
    <CollapseButton onClick={expand}>Expand ↓</CollapseButton>
  );

  const handleOpen = (type, balance, balance2, balance3) => {
    setType(type);
    setOpen(true);
    setBalance(balance);
    setBalance2(balance2);
    setBalance3(balance3);
    setAllowance(LPTokensAllowance);
  };

  const handleClose = () => {
    setSending(false);
    setType("");
    setOpen(false);
    setBalance(0);
    setAllowance(0);
  };

  const makeBN = (n) => {
    return new web3DataProvider.utils.BN(n);
  };
  const pair = currency2 ? `${currency1}/${currency2}` : currency1;

  const pairNames = {
    "gSTRING/ETH": "gSTRING_ETH_LP",
    "gSTRING/LUSD": "gSTRING_LUSD_LP",
    STRING: "STRING",
    LUSD: "LUSD",
    LQTY: "LQTY",
    ETH: "ETH",
  };

  const farmLPMap = {
    "gSTRING/ETH": "ETHLPToken",
    "gSTRING/LUSD": "LUSDLPToken",
  };

  const alloc = {
    "gSTRING/ETH": 0.8,
    "gSTRING/LUSD": 0.2,
  };

  const logosMap = {
    LUSD: liquityLogo,
    LQTY: liquityLogo,
    STRING: stringLogo,
    gSTRING: stringLogo,
    ETH: ethLogo,
  };

  const links = {
    LUSD: `https://kovan.etherscan.io/address/${addresses.kovan.stabilityPool}`,
    LQTY: `https://kovan.etherscan.io/address/${addresses.kovan.lqtyStaking}`,
    STRING: `https://kovan.etherscan.io/address/0xba593297bec35f3162f37ab2f27774a826aa6153`,
    "gSTRING/ETH": `https://kovan.etherscan.io/address/${addresses.kovan.ethLPToken}`,
    "gSTRING/LUSD": `https://kovan.etherscan.io/address${addresses.kovan.lusdLPToken}`,
  };

  let contractBal, rewardPerBlock;

  if (pair === "STRING") {
    contractBal = profitShareBalances;
    rewardPerBlock = profitShareBalances.isBoosted
      ? 0.2307692308 * 5
      : 0.2307692308;
  } else if (pair === "LUSD") {
    contractBal = factoryBalances;
    rewardPerBlock = factoryBalances.isBoosted ? 0.9230769231 * 5 : 9230769231;
  } else {
    contractBal = farmBalances;
    rewardPerBlock = farmBalances.isBoosted
      ? 0.641025641 * 5 * alloc[pair]
      : 0.641025641 * alloc[pair];
  }

  let tvlKey;

  if (contract === "farm") {
    tvlKey = farmLPMap[pair];
  } else {
    tvlKey = contract;
  }
  const pairTokensTVL = tvl[tvlKey] * parseFloat(prices[pairNames[pair]]);

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

  const margin = conditionalMargin ? (collapsed ? "0px" : "10px") : "35.5px";

  return (
    <>
      <Modal
        open={open}
        close={handleClose}
        type={type}
        balance={balance && balance}
        balance2={balance2 && balance2}
        balance3={balance3 && balance3}
        currencyEarned={currencyEarned}
        allowance={allowance && allowance}
        gSTRINGAllowance={gSTRINGAllowance}
        pair={pair}
        contract={contract}
      />
      <div style={{ marginTop: "12.5px", marginBottom: margin }}>
        <PoolContainer>
          <PairContainer>
            <ContractLink href={links[pair]} target="_blank">
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
            <Stat>
              {dailyAPY && dailyAPY !== "NaN" ? readableTrunc(dailyAPY) : "∞"}%
            </Stat>
            <Stat>
              {weeklyAPY && weeklyAPY !== "NaN"
                ? readableTrunc(weeklyAPY)
                : "∞"}
              %
            </Stat>
            <Stat>
              {yearlyAPY && yearlyAPY !== "NaN"
                ? readableTrunc(yearlyAPY)
                : "∞"}
              %
            </Stat>
          </StatContainer>
        </PoolContainer>
        <CollapseButtonContainer>{viewButton}</CollapseButtonContainer>
        <Table
          currencyEarned={currencyEarned}
          pair={pair}
          currency1={currency1}
          currency2={currency2}
          LPTokensStaked={LPTokensStaked}
          LPTokensInWallet={LPTokensInWallet}
          noClaim={noClaim}
          collapsed={collapsed}
          pendingTokens={pendingTokens}
          secondPendingTokens={secondPendingTokens}
          thirdPendingTokens={thirdPendingTokens}
          open={handleOpen}
          gSTRINGBalance={userBalances.gSTRING}
          tvl={tvl[tvlKey]}
          prices={prices}
        />
      </div>
    </>
  );
};

export default Pool;
