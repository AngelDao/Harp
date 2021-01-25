import React, { useState, useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import {
  CloseContainer,
  HeaderContainer,
  CollapseButton,
  ActionButton,
  ConnectedCircle,
  NotConnectedCircle,
  AllowanceContainer,
  AllowanceText,
  ActionContainer,
} from "./styles";
import MasterStyles from "../../utils/masterStyles";
import { toWei, fromWei, toDecimal } from "../../utils/truncateString";
import CredentialsContext from "../../context/credentialsContext";
import { Pair } from "../Farm/Pool/styles";

const ActionModal = ({ open, close, type, balance, allowance, pair }) => {
  const {
    contracts: { farm, stringToken, ETHLPToken, LUSDLPToken },
    address,
    setUserAllowances,
    userAllowances,
    web3DataProvider,
    web3UserProvider,
    reFetchData,
  } = useContext(CredentialsContext);

  const pool = {
    "STRING/ETH": 0,
    "STRING/LUSD": 1,
  };

  const token = {
    "STRING/ETH": ETHLPToken,
    "STRING/LUSD": LUSDLPToken,
    STRING: stringToken,
  };

  const pairNames = {
    "STRING/ETH": "STRING_ETH_LP",
    "STRING/LUSD": "STRING_LUSD_LP",
    STRING: "STRING",
  };

  const [value, setValue] = useState(0);

  const handleChangeValue = (num) => {
    setValue(num);
  };

  const handleClose = () => {
    setValue(0);
    close();
  };

  const handleSetMax = () => {
    setValue(parseFloat(balance));
  };

  const handleApprove = async () => {
    await token[pair].methods
      .approve(farm._address, toWei(web3DataProvider, "10000000"))
      .send({ from: address });
    // const newAllowance = await token[pair].methods
    //   .allowance(address, farm._address)
    //   .call();
    // setUserAllowances({ ...userAllowances, [pairNames[pair]]: newAllowance });
    await reFetchData();
  };

  const handleDeposit = async () => {
    try {
      await farm.methods
        .deposit(pool[pair], toWei(web3DataProvider, value.toString()))
        .send({ from: address })
        .on("transactionHash", async () => {
          await reFetchData();
        });
    } catch (err) {
      // debugger;
      console.log(err.message);
    }
  };

  const handleAction = () => {
    if (type === "Deposit") {
      handleDeposit();
    }
  };

  const allowed = parseFloat(balance) < parseFloat(allowance);

  return (
    <Modal
      borderRadius="0%"
      isOpen={open}
      onClose={handleClose}
      size="sm"
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        borderRadius="0%"
        border="3px solid black"
        backgroundColor={MasterStyles.background.menu}
      >
        <HeaderContainer>
          <ModalHeader textAlign="">{type}</ModalHeader>

          <CloseContainer>
            <ModalCloseButton
              border="none"
              outline="none"
              height="32px"
              width="32px"
              top="0px"
              position="none"
              focusBorderColor="none"
              _focus={{ boxShadow: "none" }}
            />
          </CloseContainer>
        </HeaderContainer>
        <ModalBody borderTop="2px solid black">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <span style={{ fontSize: MasterStyles.fontSize.small }}>
              Amount to {type}
            </span>
            <span style={{ fontSize: MasterStyles.fontSize.small }}>
              Available: {balance}
            </span>
          </div>
          <NumberInput
            defaultValue={0}
            min={0}
            precision={2}
            step={0.2}
            max={parseInt(balance)}
            value={value}
            inputMode="decimal"
            borderRadius="0%"
            borderColor="black"
            focusBorderColor="black"
            onChange={(str, num) => handleChangeValue(num)}
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
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <CollapseButton onClick={handleSetMax}>+ Max {type}</CollapseButton>
          </div>
        </ModalBody>
        <ModalFooter paddingTop="0px">
          <div style={{ display: "flex", flexDirection: "column" }}>
            {allowed ? (
              <AllowanceContainer>
                <ConnectedCircle />
                <AllowanceText>Approved</AllowanceText>
              </AllowanceContainer>
            ) : (
              <AllowanceContainer>
                <NotConnectedCircle />
                <AllowanceText>Needs approval</AllowanceText>
              </AllowanceContainer>
            )}
            <ActionContainer>
              {allowed ? (
                <ActionButton
                  onClick={handleAction}
                  action={true}
                  style={{ marginRight: "10px" }}
                >
                  {type}
                </ActionButton>
              ) : (
                <ActionButton
                  onClick={handleApprove}
                  action={true}
                  style={{ marginRight: "10px" }}
                >
                  Approve
                </ActionButton>
              )}
              <ActionButton action={true} onClick={handleClose}>
                Cancel
              </ActionButton>
            </ActionContainer>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ActionModal;
