import React from "react";
import MasterStyles from "../../../utils/masterStyles";
import ethLogo from "../../../assets/eth1.png";
import stringLogo from "../../../assets/string1.png";
import liquityLogo from "../../../assets/liq.svg";
import uniswapLogo from "../../../assets/uniswap2.svg";
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
  pair,
  LPTokensStaked,
  LPTokensInWallet,
  noClaim,
  collapsed,
  pendingTokens,
  secondPendingTokens,
  open,
  currency1,
  currency2,
  currencyEarned,
  gSTRINGBalance,
}) => {
  const logosMap = {
    LUSD: liquityLogo,
    LQTY: liquityLogo,
    STRING: stringLogo,
    gSTRING: stringLogo,
    ETH: ethLogo,
  };

  const pendingAmounts = [pendingTokens, secondPendingTokens];

  const sum = () => {
    let s = 0;
    pendingAmounts.forEach((a) => {
      if (a) {
        s += parseFloat(a);
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
                    <TablePL style={{ zIndex: 1 }} src={logosMap[currency1]} />
                    <TablePL
                      style={{ zIndex: 0, left: "5px" }}
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
            <span>--</span>
          </AssetCell>
          <AssetCell style={{ width: "172px" }}>
            <span>{LPTokensInWallet}</span>
          </AssetCell>
          <AssetCell>
            <span>{LPTokensStaked}</span>
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
              <span>{gSTRINGBalance}</span>
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
      {pair !== "STRING" ? (
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
                    <span>--</span>
                  </AssetCell>
                  <AssetCell style={{ width: "172px" }}>
                    <span>--</span>
                  </AssetCell>
                  <AssetCell>
                    <span>{pendingAmounts[i] ? pendingAmounts[i] : 0}</span>
                  </AssetCell>
                </ContentRow>
              );
            })}
          </InfoTable>
        </>
      ) : (
        <div style={{ marginTop: "12.5px", marginBottom: "12.5px" }}>
          <span>
            You cannot claim rewards from STRING Staking check the docs to find
            out why
          </span>
        </div>
      )}

      {pair !== "STRING" && (
        <ButtonContainer>
          <ActionButton
            action={sum() > 0}
            disabled={sum() <= 0}
            onClick={() => {
              open("Claim", pendingTokens);
            }}
          >
            Claim
          </ActionButton>
        </ButtonContainer>
      )}
    </UserInfoContainer>
  );
};

export default PoolTable;
