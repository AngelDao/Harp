import React from "react";
import MasterStyles from "../../../utils/masterStyles";
import ethLogo from "../../../assets/eth1.png";
import stringLogo from "../../../assets/string1.png";
import gStringLogo from "../../../assets/gString1.png";
import liquityLogo from "../../../assets/liq.svg";
import lusdLogo from "../../../assets/lusd.png";
import uniswapLogo from "../../../assets/uniswap2.svg";
import { readableTrunc, truncDust } from "../../../utils/truncateString";
import {
  InfoTable,
  HR,
  SubTitle,
  HeaderRow,
  Cell,
  WrapperCenter,
  HeaderTitle,
  ContentRow,
  Pair,
  AssetCell,
  TableLogoContainer,
  TablePL,
  TablePLContainer,
  ActionButton,
  ButtonContainer,
  UserInfoContainer,
} from "./styles";

const PoolTable = ({
  ps,
  pair,
  LPTokensStaked,
  LPTokensInWallet,
  noClaim,
  collapsed,
  pendingTokens,
  secondPendingTokens,
  thirdPendingTokens,
  open,
  currency1,
  currency2,
  currencyEarned,
  gSTRINGBalance,
  tvl,
  prices,
}) => {
  const logosMap = {
    LUSD: lusdLogo,
    LQTY: liquityLogo,
    STRING: stringLogo,
    gSTRING: gStringLogo,
    ETH: ethLogo,
  };

  const pairNames = {
    "gSTRING/ETH": "gSTRING_ETH_LP",
    "gSTRING/LUSD": "gSTRING_LUSD_LP",
    STRING: "STRING",
    LUSD: "LUSD",
    LQTY: "LQTY",
    ETH: "ETH",
  };

  const truncLPStaked = truncDust(LPTokensStaked);
  const truncLPinWallet = truncDust(LPTokensInWallet);
  const truncgSTRINGBalance = truncDust(gSTRINGBalance);
  const truncPendingTokens = truncDust(pendingTokens);
  const truncSecondPendingTokens = truncDust(secondPendingTokens);
  const truncThirdPendingTokens = truncDust(thirdPendingTokens);

  const pendingAmounts = [
    truncPendingTokens,
    truncSecondPendingTokens,
    truncThirdPendingTokens,
  ];

  const sum = () => {
    let s = 0;
    pendingAmounts.forEach((a, i) => {
      let val = a;
      if (a === "Dust" && i === 0) {
        val = pendingTokens;
      }
      if (a === "Dust" && i === 1) {
        val = secondPendingTokens;
      }
      if (val) {
        s += parseFloat(val);
      }
    });
    return s;
  };

  return (
    <UserInfoContainer collapsed={collapsed}>
      <SubTitle>LP</SubTitle>
      <InfoTable>
        <HeaderRow>
          <Cell style={{ marginRight: "135px" }}>
            <WrapperCenter>
              <HeaderTitle>Asset</HeaderTitle>
            </WrapperCenter>
          </Cell>
          <Cell style={{ marginRight: "80px" }}>
            <WrapperCenter>
              <HeaderTitle>TVL</HeaderTitle>
            </WrapperCenter>
          </Cell>
          <Cell style={{ marginRight: "100px" }}>
            <WrapperCenter>
              <HeaderTitle>In Wallet</HeaderTitle>
            </WrapperCenter>
          </Cell>
          <Cell>
            <WrapperCenter>
              <HeaderTitle>Staked</HeaderTitle>
            </WrapperCenter>
          </Cell>
        </HeaderRow>
        <HR />
        <ContentRow>
          <AssetCell style={{ width: "207px" }}>
            <TablePLContainer>
              <TableLogoContainer>
                {currency2 ? (
                  <>
                    <TablePL
                      style={{ zIndex: 1, left: "-5px" }}
                      src={logosMap[currency1]}
                    />
                    <TablePL
                      style={{ zIndex: 0, left: "3px" }}
                      src={logosMap[currency2]}
                    />
                  </>
                ) : (
                  <TablePL src={logosMap[currency1]} />
                )}
              </TableLogoContainer>
            </TablePLContainer>
            <Pair>{currency2 ? `${currency1}/${currency2}` : currency1}</Pair>
          </AssetCell>
          <AssetCell style={{ width: "148px" }}>
            <span>
              {currency1 === "STRING"
                ? "--"
                : tvl &&
                  `$${
                    isNaN(readableTrunc(tvl.toFixed(2)))
                      ? "0"
                      : readableTrunc(tvl.toFixed(2))
                  }`}
            </span>
          </AssetCell>
          <AssetCell style={{ width: "172px" }}>
            <span>{truncLPinWallet}</span>
          </AssetCell>
          <AssetCell>
            <span>{truncLPStaked}</span>
          </AssetCell>
        </ContentRow>
        {pair === "STRING" && (
          <ContentRow>
            <AssetCell style={{ width: "207px" }}>
              <TablePLContainer>
                <TableLogoContainer>
                  <TablePL src={logosMap["gSTRING"]} />
                </TableLogoContainer>
              </TablePLContainer>
              <Pair>gSTRING</Pair>
            </AssetCell>
            <AssetCell style={{ width: "148px" }}>
              <span>--</span>
            </AssetCell>
            <AssetCell style={{ width: "172px" }}>
              <span>{truncgSTRINGBalance}</span>
            </AssetCell>
            <AssetCell>
              <span>--</span>
            </AssetCell>
          </ContentRow>
        )}
      </InfoTable>
      <ButtonContainer>
        <ActionButton
          action={parseFloat(LPTokensInWallet) > 0}
          disabled={parseFloat(LPTokensInWallet) <= 0}
          onClick={() => {
            open("Deposit", LPTokensInWallet);
          }}
        >
          Deposit
        </ActionButton>
        <ActionButton
          style={{ marginLeft: "40px" }}
          action={parseFloat(LPTokensStaked) > 0}
          disabled={parseFloat(LPTokensStaked) <= 0}
          onClick={() => {
            open("Withdraw", LPTokensStaked);
          }}
        >
          Withdraw
        </ActionButton>
      </ButtonContainer>

      <SubTitle>Rewards</SubTitle>

      <>
        <InfoTable>
          <HeaderRow>
            <Cell style={{ marginRight: "135px" }}>
              <WrapperCenter>
                <HeaderTitle>Asset</HeaderTitle>
              </WrapperCenter>
            </Cell>
            <Cell style={{ marginRight: "80px" }}>
              <WrapperCenter>
                <HeaderTitle>Price</HeaderTitle>
              </WrapperCenter>
            </Cell>
            <Cell style={{ marginRight: "100px" }}>
              <WrapperCenter>
                <HeaderTitle>Value</HeaderTitle>
              </WrapperCenter>
            </Cell>
            <Cell>
              <WrapperCenter>
                <HeaderTitle>Pending</HeaderTitle>
              </WrapperCenter>
            </Cell>
          </HeaderRow>
          <HR />
          {currencyEarned.map((c, i) => {
            console.log(pendingAmounts[i]);
            return (
              <ContentRow>
                <AssetCell style={{ width: "207px" }}>
                  <TablePLContainer>
                    <TableLogoContainer>
                      <TablePL src={logosMap[c]} />
                    </TableLogoContainer>
                  </TablePLContainer>
                  <Pair>{c}</Pair>
                </AssetCell>
                <AssetCell style={{ width: "148px" }}>
                  <span>
                    {c === "STRING"
                      ? "--"
                      : prices &&
                        `$${readableTrunc(
                          prices[pairNames[c]].toFixed(2).toString()
                        )}`}
                  </span>
                </AssetCell>
                <AssetCell style={{ width: "172px" }}>
                  <span>
                    {c === "STRING"
                      ? "--"
                      : pendingAmounts[i] === "Dust"
                      ? "$0.00"
                      : prices && pendingAmounts[i]
                      ? `$${readableTrunc(
                          (prices[pairNames[c]] * pendingAmounts[i])
                            .toFixed(2)
                            .toString()
                        )}`
                      : "$0.00"}
                  </span>
                </AssetCell>
                <AssetCell>
                  <span>{pendingAmounts[i] ? pendingAmounts[i] : 0}</span>
                </AssetCell>
              </ContentRow>
            );
          })}
        </InfoTable>
      </>

      <ButtonContainer>
        <ActionButton
          action={sum() > 0}
          disabled={sum() <= 0}
          onClick={() => {
            open(
              "Claim",
              pendingTokens,
              secondPendingTokens,
              thirdPendingTokens
            );
          }}
        >
          Claim
        </ActionButton>
      </ButtonContainer>
    </UserInfoContainer>
  );
};

export default PoolTable;
