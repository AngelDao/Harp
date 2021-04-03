import React from "react";
import MasterStyles from "../../../utils/masterStyles";
import {
  ModalBody,
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

const Body = ({
  allowed,
  type,
  balance,
  handleBlur,
  handleFocus,
  value,
  handleChangeValue,
  pair,
  gSTRING,
  handleSetMax,
  proxy,
}) => {
  return (
    <>
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
            step={0.0001}
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
            <CollapseButton onClick={handleSetMax}>+ Max {type}</CollapseButton>
          </div>
        </ModalBody>
      ) : pair === "LUSD" && !proxy ? (
        <ModalBody
          borderTop="2px solid black"
          padding="25px 24px"
          textAlign="center"
        >
          <span>You must deploy a proxy on first time depositing</span>
        </ModalBody>
      ) : (
        <ModalBody
          borderTop="2px solid black"
          padding="25px 24px"
          textAlign="center"
        >
          <span>
            You must approve this contract in order to interact with it
          </span>
        </ModalBody>
      )}
    </>
  );
};

export default Body;
