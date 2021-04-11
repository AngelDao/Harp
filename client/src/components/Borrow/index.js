import React, { useState, useContext } from "react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Center,
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
  NotEnough,
} from "./styles";
import CredentialsContext from "../../context/credentialsContext";
import {
  fromWei,
  truncateAddress,
  truncDust,
} from "../../utils/truncateString";
import { fetchPage } from "../../utils/handleContracts/fetchPage";
import Loader from "../Loader";
import { ape, embrace } from "./ape";
import BorrowModal from "../Modal/BorrowModal";

const Borrow = () => {
  const {
    troves,
    userTrove,
    prices,
    setTroves,
    contracts: { troveManager, sortedTroves },
    userBalances,
    borrowRate,
  } = useContext(CredentialsContext);

  const [memTrove, setMemTrove] = useState({
    collat: 0,
    debt: 0,
    cRatio: 0,
  });
  const [currentPage, setPage] = useState(1);
  const [internalLoading, setInternalLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setError] = useState(false);

  const handleChangeBorrowValue = (num) => {
    const requiredColl = 1.2;
    const lusdUSD = parseFloat(num) * prices.LUSD;
    const newCollat = (lusdUSD * requiredColl) / prices.ETH;
    const cr =
      memTrove.collat &&
      (memTrove.collat * prices.ETH) / lusdUSD >= requiredColl
        ? ((memTrove.collat * prices.ETH) / lusdUSD) * 100
        : ((newCollat * prices.ETH) / lusdUSD) * 100;

    const tColl = truncDust(fromWei(web3, userTrove.coll));

    const collat =
      memTrove.collat &&
      (memTrove.collat * prices.ETH) / lusdUSD >= requiredColl
        ? memTrove.collat
        : newCollat;

    if (tColl <= 0 && num < 2000 && num !== 0) {
      setError("Borrow must be > 2000");
    } else if (
      parseFloat(collat.toFixed(4)) > parseFloat(userBalances.ETH).toFixed(4)
    ) {
      setError("Not enough collateral");
    } else {
      setError("");
    }

    setMemTrove({
      debt: num,
      collat: collat,
      cRatio: cr.toFixed(2),
    });
  };

  const handleChangeCollValue = (num) => {
    const requiredColl = 1.2;
    const ethUSD = parseFloat(num) * prices.ETH;
    const lusdUSD = parseFloat(memTrove.debt) * prices.LUSD;
    const newBorrow = ethUSD / requiredColl;
    const cr =
      memTrove.collat &&
      memTrove.debt &&
      ethUSD / (memTrove.debt * prices.LUSD) >= requiredColl
        ? (ethUSD / lusdUSD) * 100
        : (ethUSD / newBorrow) * 100;

    console.log(newBorrow * borrowRate);
    console.log(memTrove.debt * borrowRate);
    const debt =
      memTrove.debt && ethUSD / (memTrove.debt * prices.LUSD) >= requiredColl
        ? memTrove.debt
        : newBorrow / prices.LUSD;

    const tColl = truncDust(fromWei(web3, userTrove.coll));

    if (tColl <= 0 && debt < 2000 && debt !== 0) {
      setError("Borrow must be > 2000");
    } else if (
      parseFloat(num.toFixed(4)) > parseFloat(userBalances.ETH).toFixed(4)
    ) {
      setError("Not enough collateral");
    } else {
      setError("");
    }
    setMemTrove({
      collat: num,
      debt: debt,
      cRatio: cr.toFixed(2),
    });
  };

  const handleSetMax = () => {
    handleChangeCollValue(parseFloat(userBalances.ETH));
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

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClear = () => {
    setMemTrove({
      collat: 0,
      debt: 0,
      cRatio: 0,
    });
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

  const tDebt = truncDust(fromWei(web3, userTrove.debt));
  const tColl = truncDust(fromWei(web3, userTrove.coll));
  const uBal = parseFloat(userBalances.ETH);

  const overDebtMin = tColl > 0 ? true : memTrove.debt >= 2000;

  return (
    <>
      <BorrowModal
        isOpen={isOpen}
        open={handleOpen}
        close={handleClose}
        coll={memTrove.collat}
        debt={memTrove.debt}
        cr={memTrove.cRatio}
      />
      <div style={{ marginTop: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "375px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title>Add To Trove</Title>
              {(uBal * prices.ETH > 2000 || tDebt > 0) && (
                <a
                  onClick={() => handleSetMax()}
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  + Add Max
                </a>
              )}
            </div>
            <DescContainer>
              {uBal * prices.ETH > 2000 || tDebt > 0 ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <SubTitle>Borrow(LUSD)</SubTitle>
                    <span>
                      Fee:{" "}
                      {isNaN((memTrove.debt * borrowRate).toFixed(4))
                        ? "0.0000"
                        : (memTrove.debt * borrowRate).toFixed(4)}
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
                    value={isNaN(memTrove.debt) ? 0 : memTrove.debt}
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
                      marginTop: "10px",
                    }}
                  >
                    <SubTitle>Collateral(ETH)</SubTitle>
                    <span style={{ marginBottom: "6px" }}>
                      Available: {truncDust(uBal.toFixed(4))}
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
                    value={isNaN(memTrove.collat) ? 0 : memTrove.collat}
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
                    value={isNaN(memTrove.cRatio) ? 0 : memTrove.cRatio}
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
                  <span style={{ marginTop: "6px" }}>{errorMsg}</span>
                </>
              ) : (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <NotEnough
                    style={{ width: "37%", height: "165px" }}
                    value={ape}
                  />
                  <span style={{ marginTop: "20px" }}>
                    In order to borrow/ape you must have $2000 worth of ETH
                    minimum or an open trove!
                  </span>
                </div>
              )}
            </DescContainer>
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "flex-end ",
                height: "33px",
              }}
            >
              {(uBal * prices.ETH > 2000 || tDebt > 0) && (
                <>
                  <ActionButton
                    onClick={handleOpen}
                    action={
                      memTrove.collat <= uBal &&
                      memTrove.collat > 0 &&
                      overDebtMin
                    }
                    disabled={
                      !(
                        memTrove.collat <= uBal &&
                        memTrove.collat > 0 &&
                        overDebtMin
                      )
                    }
                  >
                    Add
                  </ActionButton>
                  <ActionButton
                    style={{ marginLeft: "40px" }}
                    onClick={handleClear}
                    action
                  >
                    Clear
                  </ActionButton>
                </>
              )}
            </div>
          </div>
          <div style={{ width: "300px" }}>
            <Title>My Trove</Title>
            <DescContainer>
              {parseFloat(truncDust(fromWei(web3, userTrove.debt))) > 0 ? (
                <>
                  <SubTitle>Borrow(LUSD)</SubTitle>
                  <NumberInput
                    //   onBlur={() => handleBlur("debt")}
                    //   onFocus={() => handleFocus("debt")}
                    isReadOnly
                    defaultValue={0}
                    min={0}
                    precision={4}
                    step={0.2}
                    //   max={parseFloat(memTrove.debt)}
                    value={truncDust(fromWei(web3, userTrove.debt))}
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
                  <SubTitle style={{ marginTop: "10px" }}>
                    Collateral(ETH)
                  </SubTitle>
                  <NumberInput
                    //   onBlur={() => handleBlur("collat")}
                    //   onFocus={() => handleFocus("collat")}
                    defaultValue={0}
                    min={0}
                    isReadOnly
                    precision={4}
                    step={0.2}
                    //   max={parseFloat(memTrove.debt)}
                    value={truncDust(fromWei(web3, userTrove.coll))}
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
                    Collateralization Ratio(%)
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
                </>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span>You have not yet opened a trove!</span>
                </div>
              )}
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
    </>
  );
};

export default Borrow;
