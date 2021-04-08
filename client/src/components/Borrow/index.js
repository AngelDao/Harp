import React, { useState, useContext } from "react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import MasterStyles from "../../utils/masterStyles";
import {
  DescContainer,
  Title,
  SubTitle,
  ActionButton,
  HeaderRow,
  HeaderTitle,
  WrapperCenter,
  Cell,
  HR,
  ContentRow,
  AssetCell,
} from "./styles";
import CredentialsContext from "../../context/credentialsContext";
import {
  fromWei,
  truncateAddress,
  truncDust,
} from "../../utils/truncateString";
import { fetchPage } from "../../utils/handleContracts/fetchPage";
import Loader from "../Loader";
const Borrow = () => {
  const {
    troves,
    userTrove,
    prices,
    setTroves,
    contracts: { troveManager, sortedTroves },
    userBalances,
  } = useContext(CredentialsContext);

  const [memTrove, setMemTrove] = useState({
    collat: 0,
    debt: 0,
    cRatio: 0,
  });
  const [currentPage, setPage] = useState(1);
  const [internalLoading, setInternalLoading] = useState(false);

  const handleChangeBorrowValue = (num) => {
    const requiredColl = 1.1;
    const lusdUSD = parseFloat(num) * prices.LUSD;
    const newCollat = (lusdUSD * requiredColl) / prices.ETH;
    const cr =
      memTrove.collat &&
      (memTrove.collat * prices.ETH) / lusdUSD >= requiredColl
        ? ((memTrove.collat * prices.ETH) / lusdUSD) * 100
        : ((newCollat * prices.ETH) / lusdUSD) * 100;

    setMemTrove({
      debt: num,
      collat:
        memTrove.collat &&
        (memTrove.collat * prices.ETH) / lusdUSD >= requiredColl
          ? memTrove.collat
          : newCollat,
      cRatio: cr.toFixed(2),
    });
  };

  const handleChangeCollValue = (num) => {
    const requiredColl = 1.1;
    const ethUSD = parseFloat(num) * prices.ETH;
    const lusdUSD = parseFloat(memTrove.debt) * prices.LUSD;
    const newBorrow = ethUSD / requiredColl;
    const cr =
      memTrove.collat &&
      memTrove.debt &&
      ethUSD / (memTrove.debt * prices.LUSD) >= requiredColl
        ? (ethUSD / lusdUSD) * 100
        : (ethUSD / newBorrow) * 100;

    setMemTrove({
      collat: num,
      debt:
        memTrove.debt && ethUSD / (memTrove.debt * prices.LUSD) >= requiredColl
          ? memTrove.debt
          : newBorrow / prices.LUSD,
      cRatio: cr.toFixed(2),
    });
  };

  const handleFocus = (type) => {
    if (memTrove[type] === 0) {
      setMemTrove({ ...memTrove, [type]: "" });
    }
  };

  const handleBlur = (type) => {
    if (memTrove[type] === "") {
      setMemTrove({ ...memTrove, [type]: 0 });
    }
  };

  const handlePageChange = async (num) => {
    if (num > 0 && !internalLoading && num * 10 - troves.troveCount < 10) {
      if (troves.troves[num]) {
        setPage(num);
      } else {
        setInternalLoading(true);
        await fetchPage(setTroves, troves, sortedTroves, troveManager, num);
        setPage(num);
        setInternalLoading(false);
      }
    }
  };

  const pageInfoText = () => {
    const from = 1;
    const to = 10;

    return `${from * currentPage * 10 - 9}-${
      to * currentPage > troves.troveCount
        ? troves.troveCount
        : to * currentPage
    } of ${troves.troveCount}`;
  };

  // return (
  //   <div
  //     style={{
  //       width: "100%",
  //       display: "flex",
  //       justifyContent: "center",
  //       alignItems: "center",
  //       height: "400px",
  //     }}
  //   >
  //     <span style={{ fontSize: MasterStyles.fontSize.veryLarge }}>soon™</span>
  //   </div>
  // );

  const web3 = window.web3;

  const cr =
    ((parseFloat(userTrove.coll) * prices.ETH) /
      (parseFloat(userTrove.debt) * prices.LUSD)) *
    100;

  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "375px" }}>
          <Title>Add To Trove</Title>
          <DescContainer>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <SubTitle>Borrow(LUSD)</SubTitle>
              <span style={{ marginBottom: "6px" }}>
                Balance: {truncDust(parseFloat(userBalances.LUSD).toFixed(4))}
              </span>
            </div>
            <NumberInput
              onBlur={() => handleBlur("debt")}
              onFocus={() => handleFocus("debt")}
              defaultValue={0}
              min={0}
              precision={4}
              step={0.2}
              //   max={parseFloat(memTrove.debt)}
              value={memTrove.debt}
              inputMode="decimal"
              borderRadius="0%"
              borderColor="black"
              focusBorderColor="black"
              onChange={(str, num) => handleChangeBorrowValue(num)}
              outline="none"
              backgroundColor={MasterStyles.background.secondaryMenu}
            >
              <NumberInputField
                borderRadius="0%"
                border="2px solid black"
                outline="none"
                _hover={{ borderColor: "black" }}
                backgroundColor={MasterStyles.background.secondaryMenu}
              />
              <NumberInputStepper border="none">
                <NumberIncrementStepper border="none" />
                <NumberDecrementStepper border="none" />
              </NumberInputStepper>
            </NumberInput>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: "6px",
              }}
            >
              <SubTitle>Collateral(ETH)</SubTitle>
              <span style={{ marginBottom: "6px" }}>
                Balance: {truncDust(parseFloat(userBalances.ETH).toFixed(4))}
              </span>
            </div>
            <NumberInput
              onBlur={() => handleBlur("collat")}
              onFocus={() => handleFocus("collat")}
              defaultValue={0}
              min={0}
              precision={4}
              step={0.2}
              //   max={parseFloat(memTrove.debt)}
              value={memTrove.collat}
              inputMode="decimal"
              borderRadius="0%"
              borderColor="black"
              focusBorderColor="black"
              onChange={(str, num) => handleChangeCollValue(num)}
              outline="none"
              backgroundColor={MasterStyles.background.secondaryMenu}
            >
              <NumberInputField
                borderRadius="0%"
                border="2px solid black"
                outline="none"
                _hover={{ borderColor: "black" }}
                backgroundColor={MasterStyles.background.secondaryMenu}
              />
              <NumberInputStepper border="none">
                <NumberIncrementStepper border="none" />
                <NumberDecrementStepper border="none" />
              </NumberInputStepper>
            </NumberInput>
            <SubTitle style={{ marginTop: "10px" }}>
              Collateralization Ratio(%)
            </SubTitle>
            <NumberInput
              defaultValue={0}
              min={0}
              precision={4}
              step={0.2}
              //   max={parseFloat(memTrove.debt)}
              value={memTrove.cRatio}
              inputMode="decimal"
              borderRadius="0%"
              borderColor="black"
              focusBorderColor="black"
              isReadOnly
              //   onChange={(str, num) => handleChangeValue("cRatio", num)}
              outline="none"
              cursor="pointer"
              backgroundColor={MasterStyles.background.secondaryMenu}
            >
              <NumberInputField
                borderRadius="0%"
                border="2px solid black"
                outline="none"
                _hover={{ borderColor: "black" }}
                backgroundColor={MasterStyles.background.secondaryMenu}
              />
            </NumberInput>
          </DescContainer>
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <ActionButton action>Add</ActionButton>
            <ActionButton action>Clear</ActionButton>
          </div>
        </div>
        <div style={{ width: "300px" }}>
          <Title>My Trove</Title>
          <DescContainer>
            <SubTitle>Borrow</SubTitle>
            <NumberInput
              //   onBlur={() => handleBlur("debt")}
              //   onFocus={() => handleFocus("debt")}
              isReadOnly
              defaultValue={0}
              min={0}
              precision={4}
              step={0.2}
              //   max={parseFloat(memTrove.debt)}
              value={truncDust(parseFloat(userTrove.debt))}
              inputMode="decimal"
              borderRadius="0%"
              borderColor="black"
              focusBorderColor="black"
              //   onChange={(str, num) => handleChangeValue("debt", num)}
              outline="none"
              backgroundColor={MasterStyles.background.menu}
            >
              <NumberInputField
                borderRadius="0%"
                border="2px solid black"
                outline="none"
                _hover={{ borderColor: "black" }}
                backgroundColor={MasterStyles.background.menu}
              />
            </NumberInput>
            <SubTitle style={{ marginTop: "10px" }}>Collateral</SubTitle>
            <NumberInput
              //   onBlur={() => handleBlur("collat")}
              //   onFocus={() => handleFocus("collat")}
              defaultValue={0}
              min={0}
              isReadOnly
              precision={4}
              step={0.2}
              //   max={parseFloat(memTrove.debt)}
              value={truncDust(parseFloat(userTrove.coll))}
              inputMode="decimal"
              borderRadius="0%"
              borderColor="black"
              focusBorderColor="black"
              //   onChange={(str, num) => handleChangeValue("collat", num)}
              outline="none"
              backgroundColor={MasterStyles.background.menu}
            >
              <NumberInputField
                borderRadius="0%"
                border="2px solid black"
                outline="none"
                _hover={{ borderColor: "black" }}
                backgroundColor={MasterStyles.background.menu}
              />
            </NumberInput>
            <SubTitle style={{ marginTop: "10px" }}>
              Collateralization Ratio
            </SubTitle>
            <NumberInput
              defaultValue={0}
              min={0}
              precision={4}
              step={0.2}
              //   max={parseFloat(memTrove.debt)}
              value={cr.toFixed(2) !== "NaN" ? cr.toFixed(2) : 0}
              inputMode="decimal"
              borderRadius="0%"
              borderColor="black"
              focusBorderColor="black"
              isReadOnly
              //   onChange={(str, num) => handleChangeValue("cRatio", num)}
              outline="none"
              cursor="pointer"
              backgroundColor={MasterStyles.background.menu}
            >
              <NumberInputField
                borderRadius="0%"
                border="2px solid black"
                outline="none"
                _hover={{ borderColor: "black" }}
                backgroundColor={MasterStyles.background.menu}
              />
            </NumberInput>
          </DescContainer>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Title>All Troves</Title>
        <div
          style={{
            width: "250px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{pageInfoText()}</span>
          <div>
            <a
              onClick={() => handlePageChange(currentPage - 1)}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              &larr; Previous
            </a>{" "}
            -{" "}
            <a
              onClick={() => handlePageChange(currentPage + 1)}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Next &rarr;
            </a>
          </div>
        </div>
      </div>
      <DescContainer style={{ height: "567.5px" }}>
        <HeaderRow>
          <Cell style={{ marginRight: "135px" }}>
            <WrapperCenter>
              <HeaderTitle>Owner</HeaderTitle>
            </WrapperCenter>
          </Cell>
          <Cell style={{ marginRight: "80px" }}>
            <WrapperCenter>
              <HeaderTitle>Collateral(ETH)</HeaderTitle>
            </WrapperCenter>
          </Cell>
          <Cell style={{ marginRight: "100px" }}>
            <WrapperCenter>
              <HeaderTitle>Debt(LUSD)</HeaderTitle>
            </WrapperCenter>
          </Cell>
          <Cell>
            <WrapperCenter style={{ width: "100px" }}>
              <HeaderTitle>Coll. Ratio</HeaderTitle>
            </WrapperCenter>
          </Cell>
        </HeaderRow>
        <HR />
        {!internalLoading ? (
          troves.troves[currentPage].map((e, i) => {
            const { owner, trove } = e;
            const debt = fromWei(web3, trove.debt);
            const collateral = fromWei(web3, trove.coll);
            const cr =
              ((parseFloat(collateral) * prices.ETH) /
                (parseFloat(debt) * prices.LUSD)) *
              100;

            return (
              <ContentRow>
                <AssetCell style={{ width: "207px" }}>
                  <span>{truncateAddress(owner)}</span>
                </AssetCell>
                <AssetCell style={{ width: "148px" }}>
                  <span>{truncDust(collateral)}</span>
                </AssetCell>
                <AssetCell style={{ width: "172px" }}>
                  <span>{truncDust(debt)}</span>
                </AssetCell>
                <AssetCell>
                  <span>{cr.toFixed(2)}%</span>
                </AssetCell>
              </ContentRow>
            );
          })
        ) : (
          <Loader status={"FETCHING"} />
        )}
      </DescContainer>
    </div>
  );
};

export default Borrow;
