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
import { fromWei } from "../../utils/truncateString";
const Borrow = () => {
  const { troves, userTrove } = useContext(CredentialsContext);

  const [memTrove, setTrove] = useState({
    collat: 0,
    debt: 0,
    cRatio: 0,
  });

  const handleChangeValue = (type, num) => {
    let temp = num;
    if (!num) {
      temp = "";
    }
    if (num === 0) {
      temp = 0;
    }
    setTrove({ ...memTrove, [type]: temp });
  };

  const handleFocus = (type) => {
    if (memTrove[type] === 0) {
      setTrove({ ...memTrove, [type]: "" });
    }
  };

  const handleBlur = (type) => {
    if (memTrove[type] === "") {
      setTrove({ ...memTrove, [type]: 0 });
    }
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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "375px" }}>
          <Title>Add To Trove</Title>
          <DescContainer>
            <SubTitle>Borrow</SubTitle>
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
              onChange={(str, num) => handleChangeValue("debt", num)}
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
            <SubTitle style={{ marginTop: "10px" }}>Collateral</SubTitle>
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
              onChange={(str, num) => handleChangeValue("collat", num)}
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
              Collateralization Ratio
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
              value={memTrove.debt}
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
              value={memTrove.collat}
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
              value={memTrove.cRatio}
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
      <Title>All Troves</Title>
      <DescContainer>
        <HeaderRow>
          <Cell style={{ marginRight: "135px" }}>
            <WrapperCenter>
              <HeaderTitle>Owner</HeaderTitle>
            </WrapperCenter>
          </Cell>
          <Cell style={{ marginRight: "80px" }}>
            <WrapperCenter>
              <HeaderTitle>Collateral</HeaderTitle>
            </WrapperCenter>
          </Cell>
          <Cell style={{ marginRight: "100px" }}>
            <WrapperCenter>
              <HeaderTitle>Debt</HeaderTitle>
            </WrapperCenter>
          </Cell>
          <Cell>
            <WrapperCenter style={{ width: "100px" }}>
              <HeaderTitle>Coll. Ratio</HeaderTitle>
            </WrapperCenter>
          </Cell>
        </HeaderRow>
        <HR />
        {Object.entries(troves).map(([owner, res], i) => {
          const debt = fromWei(web3, res.debt);
          const collateral = fromWei(web3, res.coll);
          debugger;

          return (
            <ContentRow>
              <AssetCell style={{ width: "207px" }}>
                <span>{owner}</span>
              </AssetCell>
              <AssetCell style={{ width: "148px" }}>
                <span>{collateral}</span>
              </AssetCell>
              <AssetCell style={{ width: "172px" }}>
                <span>{debt}</span>
              </AssetCell>
              <AssetCell>
                <span></span>
              </AssetCell>
            </ContentRow>
          );
        })}
      </DescContainer>
    </div>
  );
};

export default Borrow;
