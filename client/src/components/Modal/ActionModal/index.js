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
  GStringCap,
} from "./styles";
import MasterStyles from "../../../utils/masterStyles";
import { toWei, fromWei, toDecimal } from "../../../utils/truncateString";
import CredentialsContext from "../../../context/credentialsContext";
import { Pair } from "../../Farm/Pool/styles";

const ActionModal = ({
  open,
  close,
  type,
  balance,
  allowance,
  pair,
  contract,
}) => {
  const {
    contracts: {
      farm,
      stringToken,
      ETHLPToken,
      LUSDLPToken,
      lusdToken,
      profitShare,
    },
    address,
    setUserAllowances,
    userAllowances,
    web3DataProvider,
    web3UserProvider,
    reFetchData,
    userBalances,
  } = useContext(CredentialsContext);

  const pool = {
    "gSTRING/ETH": 0,
    "gSTRING/LUSD": 1,
  };

  const token = {
    "gSTRING/ETH": ETHLPToken,
    "gSTRING/LUSD": LUSDLPToken,
    STRING: stringToken,
    LUSD: lusdToken,
  };

  const pairNames = {
    "gSTRING/ETH": "gSTRING_ETH_LP",
    "gSTRING/LUSD": "gSTRING_LUSD_LP",
    STRING: "STRING",
    LUSD: "LUSD",
  };

  const contractInstance = {
    farm,
    profitShare,
  };

  const [value, setValue] = useState(0);

  const handleChangeValue = (num) => {
    let temp = num;
    if (!num) {
      temp = "";
    }
    if (num === 0) {
      temp = 0;
    }
    setValue(temp);
  };

  const handleFocus = () => {
    if (value === 0) {
      setValue("");
    }
  };

  const handleBlur = () => {
    if (value === "") {
      setValue(0);
    }
  };

  const handleClose = () => {
    setValue(0);
    close();
  };

  const handleSetMax = () => {
    const { gSTRING } = userBalances;
    if (pair === "STRING" && type === "Withdraw") {
      setValue(parseFloat(gSTRING));
    } else {
      setValue(parseFloat(balance));
    }
  };

  const handleApprove = async () => {
    const contractAddress =
      contract === "farm" ? farm._address : profitShare._address;

    await token[pair].methods
      .approve(contractAddress, toWei(web3DataProvider, "10000000"))
      .send({ from: address })
      .on("transactionHash", async () => {
        await reFetchData();
      })
      .on("receipt", async () => {
        await reFetchData();
      });
    close();
  };

  const handleDeposit = async () => {
    const ctrct = contractInstance[contract];
    const param1 =
      contract === "farm" && pair !== "LUSD"
        ? pool[pair]
        : toWei(web3DataProvider, value.toString());

    const param2 =
      contract === "farm" && pair !== "LUSD"
        ? toWei(web3DataProvider, value.toString())
        : "hint ";

    if (pair === "LUSD") {
      try {
        await ctrct.methods
          .depositSP(param1, param2)
          .send({ from: address })
          .on("transactionHash", async () => {
            await reFetchData();
          })
          .on("receipt", async () => {
            await reFetchData();
          });
      } catch (err) {
        console.log(err.message);
      }
    } else if (contract === "profitShare") {
      try {
        await ctrct.methods
          .deposit(param1)
          .send({ from: address })
          .on("transactionHash", async () => {
            await reFetchData();
          })
          .on("receipt", async () => {
            await reFetchData();
          });
      } catch (err) {
        console.log(err.message);
      }
    } else {
      try {
        await ctrct.methods
          .deposit(param1, param2)
          .send({ from: address })
          .on("transactionHash", async () => {
            await reFetchData();
          })
          .on("receipt", async () => {
            await reFetchData();
          });
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const handleWithdraw = async () => {
    const ctrct = contractInstance[contract];
    const param1 =
      contract === "farm" && pair !== "LUSD"
        ? pool[pair]
        : toWei(web3DataProvider, value.toString());

    const param2 =
      contract === "farm" && pair !== "LUSD"
        ? toWei(web3DataProvider, value.toString())
        : "hint ";

    if (contract === "profitShare") {
      try {
        await ctrct.methods
          .withdraw(param1)
          .send({ from: address })
          .on("transactionHash", async () => {
            await reFetchData();
          })
          .on("receipt", async () => {
            await reFetchData();
          });
      } catch (err) {
        console.log(err.message);
      }
    } else {
      await ctrct.methods
        .withdraw(param1, param2)
        .send({ from: address })
        .on("transactionHash", async () => {
          await reFetchData();
        })
        .on("receipt", async () => {
          await reFetchData();
        });
    }
  };

  const handleAction = async () => {
    switch (type) {
      case "Deposit":
        await handleDeposit();
        close();
        break;
      case "Withdraw":
        await handleWithdraw();
        close();
    }
  };

  const allowed = parseFloat(balance) < parseFloat(allowance);

  const gSTRING = userBalances.gSTRING;

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
          {allowed ? (
            <AllowanceContainer>
              <AllowanceText>Approved</AllowanceText>
              <ConnectedCircle />
            </AllowanceContainer>
          ) : (
            <AllowanceContainer>
              <AllowanceText>Needs approval</AllowanceText>
              <NotConnectedCircle />
            </AllowanceContainer>
          )}
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
        {allowed ? (
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
              onBlur={handleBlur}
              onFocus={handleFocus}
              defaultValue={0}
              min={0}
              precision={4}
              step={0.2}
              max={parseFloat(balance)}
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
            <div
              style={{
                display: "flex",
                justifyContent:
                  pair === "STRING" && type === "Withdraw"
                    ? "space-between"
                    : "flex-end",
              }}
            >
              {pair === "STRING" && type === "Withdraw" && (
                <GStringCap>gSTRING Cap: {gSTRING}</GStringCap>
              )}
              <CollapseButton onClick={handleSetMax}>
                + Max {type}
              </CollapseButton>
            </div>
          </ModalBody>
        ) : (
          <ModalBody
            borderTop="2px solid black"
            padding="25px 24px"
            textAlign="center"
          >
            <span>You must approve the farm in order to use it</span>
          </ModalBody>
        )}
        <ModalFooter paddingTop="0px">
          <div style={{ display: "flex", flexDirection: "column" }}>
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
