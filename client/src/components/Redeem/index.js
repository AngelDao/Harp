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
import { ape, embrace, angel } from "../Borrow/ape";
import RedeemModal from "../Modal/RedeemModal";

const Redeem = () => {
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
  });
  const [currentPage, setPage] = useState(1);
  const [internalLoading, setInternalLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setError] = useState("");
  const [toClose, setToClose] = useState(false);

  const handleChangeBorrowValue = (num) => {
    const tCollusd = parseFloat(fromWei(web3, userTrove.coll)) * prices.ETH;
    const tDebtusd = parseFloat(fromWei(web3, userTrove.debt)) * prices.LUSD;
    const lusdUSD = parseFloat(num) * prices.LUSD;
    const paybackRatio = tCollusd / tDebtusd;
    const newCollat = (lusdUSD * paybackRatio) / prices.ETH;

    if (parseFloat(num.toFixed(4)) > parseFloat(userBalances.LUSD).toFixed(4)) {
      setError("Exceeds available LUSD in wallet");
    } else {
      setError("");
    }

    setMemTrove({
      debt: num,
      collat: newCollat,
    });
  };

  const handleChangeCollValue = (num, max) => {
    const tCollusd = parseFloat(fromWei(web3, userTrove.coll)) * prices.ETH;
    const tDebtusd = parseFloat(fromWei(web3, userTrove.debt)) * prices.LUSD;
    const ethUSD = parseFloat(num) * prices.ETH;
    const paybackRatio = tCollusd / tDebtusd;
    const newDebt = ethUSD / paybackRatio / prices.LUSD;

    if (max && newDebt > parseFloat(userBalances.LUSD)) {
      handleChangeBorrowValue(
        parseFloat(
          (parseFloat(fromWei(web3, userTrove.debt)) - 2000.1).toFixed(6)
        )
      );
      return;
    }

    const tColl = parseFloat(fromWei(web3, userTrove.coll));

    if (num > tColl) {
      setError("Exceeds Trove collateral");
    } else {
      setError("");
    }

    setMemTrove({
      collat: num,
      debt: newDebt,
    });
  };

  const handleSetMax = () => {
    const tColl = fromWei(web3, userTrove.coll);
    handleChangeCollValue(parseFloat(tColl), true);
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

  const handleOpen = (type) => {
    if (type) {
      setToClose(true);
    }
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

  const tDebt = parseFloat(truncDust(fromWei(web3, userTrove.debt)));
  const tColl = parseFloat(truncDust(fromWei(web3, userTrove.coll)));
  const uBal = parseFloat(userBalances.ETH);

  return (
    <>
      <RedeemModal
        toClose={toClose}
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
              <Title>Repay Debt</Title>
              {tColl > 0 && (
                <a
                  onClick={() => handleSetMax()}
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  - Repay Max
                </a>
              )}
            </div>
            <DescContainer>
              {tColl > 0 ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    <SubTitle>Repay(LUSD)</SubTitle>
                    <span style={{ marginBottom: "6px" }}>
                      Available:{" "}
                      {(
                        parseFloat(fromWei(web3, userTrove.debt)).toFixed(4) -
                        2000
                      ).toFixed(4)}
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
                    <SubTitle>Recieve(ETH)</SubTitle>
                    <span style={{ marginBottom: "6px" }}>
                      Collateral: {truncDust(parseFloat(tColl).toFixed(4))}
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
                    value={angel}
                  />
                  <span style={{ marginTop: "20px" }}>
                    In order to redeem you must have a Trove open!
                  </span>
                </div>
              )}
            </DescContainer>
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "flex-end",
                height: "33px",
              }}
            >
              {tColl > 0 && (
                <>
                  <ActionButton
                    onClick={handleOpen}
                    action={
                      memTrove.collat.toFixed(5) <= tColl.toFixed(5) &&
                      memTrove.collat > 0 &&
                      memTrove.debt <= parseFloat(userBalances.LUSD)
                    }
                    disabled={
                      !(
                        memTrove.collat.toFixed(5) <= tColl.toFixed(5) &&
                        memTrove.collat > 0 &&
                        memTrove.debt <= parseFloat(userBalances.LUSD)
                      )
                    }
                  >
                    Repay
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
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "flex-end",
                height: "33px",
              }}
            >
              {tColl > 0 && (
                <ActionButton
                  style={{ marginLeft: "40px", width: "130px" }}
                  onClick={() => handleOpen("close")}
                  action={
                    parseFloat(userBalances.LUSD) >
                    parseFloat(fromWei(web3, userTrove.debt))
                  }
                  disabled={
                    !(
                      parseFloat(userBalances.LUSD) >
                      parseFloat(fromWei(web3, userTrove.debt))
                    )
                  }
                >
                  Close Trove
                </ActionButton>
              )}
            </div>
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

export default Redeem;
