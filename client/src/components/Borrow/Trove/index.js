import React, { useState, useContext } from "react";
import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import {
  TroveFormContainer,
  TroveRow,
  ActionButton,
  ActionButtonContainer,
} from "./styles";
import MasterStyles from "../../../utils/masterStyles";
import CredentialsContext from "../../../context/credentialsContext";

const Trove = ({
  trove,
  setTrove,
  ethPrice,
  userBalances,
  minDebt,
  minRatio,
}) => {
  // TODO: actually use this value, give notification or change input field to provide user feedback
  const [ratioValidity, setRatioValidity] = useState();
  // TODO: replace place holders
  const ethBalance = "10";
  const lusdBalance = userBalances.LUSD;

  const { web3DataProvider, farmBalances, prices } = useContext(
    CredentialsContext
  );
  const web3 = web3DataProvider;

  const handleRatioValidity = (ratio) => {
    if (ratio < minRatio) setRatioValidity(false);
    else setRatioValidity(true);
  };

  const calculateRatio = (eth, lusd) => {
    return (eth * ethPrice) / lusd;
  };

  const handleCollateralInput = (val) => {
    const ratio = calculateRatio(val, trove.debt);
    setTrove({ ...trove, ratio: ratio, collateral: val });
    handleRatioValidity(ratio);
  };

  const handleDebtInput = (val) => {
    const ratio = calculateRatio(trove.collateral, val);
    setTrove({ ...trove, ratio: ratio, debt: val });
    handleRatioValidity(ratio);
  };

  const numberInputFieldProps = {
    borderRadius: "0%",
    border: "2px solid black",
    outline: "none",
    _hover: { borderColor: "black" },
    backgroundColor: MasterStyles.background.secondaryMenu,
  };

  const numberInputProps = {
    step: 0.1,
    inputMode: "decimal",
    borderRadius: "0%",
    borderColor: "black",
    focusBorderColor: "black",
    outline: "none",
    backgroundColor: MasterStyles.background.secondaryMenu,
  };

  return (
    <>
      <TroveFormContainer>
        <FormControl id="collateral" pt={2}>
          <TroveRow>
            <FormLabel>
              <span style={{ fontSize: MasterStyles.fontSize.large }}>
                Collateral [ETH]
              </span>
            </FormLabel>
            <NumberInput
              defaultValue={0}
              min={0}
              precision={2}
              max={parseInt(ethBalance)}
              value={trove.collateral}
              onChange={(str, num) => handleCollateralInput(num)}
              {...numberInputProps}
            >
              <NumberInputField {...numberInputFieldProps} />
              <NumberInputStepper border="none">
                <NumberIncrementStepper border="none" />
                <NumberDecrementStepper border="none" />
              </NumberInputStepper>
            </NumberInput>
          </TroveRow>
        </FormControl>

        <FormControl id="debt" pt={2}>
          <TroveRow>
            <FormLabel>
              <span style={{ fontSize: MasterStyles.fontSize.large }}>
                Debt [LUSD]
              </span>
            </FormLabel>
            <NumberInput
              defaultValue={0}
              min={0}
              precision={2}
              step={0.1}
              max={parseInt(lusdBalance)}
              value={trove.debt}
              onChange={(str, num) => handleDebtInput(num)}
              {...numberInputProps}
            >
              <NumberInputField {...numberInputFieldProps} />
              <NumberInputStepper border="none">
                <NumberIncrementStepper border="none" />
                <NumberDecrementStepper border="none" />
              </NumberInputStepper>
            </NumberInput>
          </TroveRow>
        </FormControl>

        <FormControl id="ratio" pt={2}>
          <TroveRow>
            <FormLabel>
              <span style={{ fontSize: MasterStyles.fontSize.large }}>
                Collateral Ratio
              </span>
            </FormLabel>
            <NumberInput
              precision={2}
              value={trove.ratio}
              {...numberInputProps}
            >
              <NumberInputField {...numberInputFieldProps} />
            </NumberInput>
          </TroveRow>
        </FormControl>

        <ActionButtonContainer>
          <ActionButton
            action={0 > 0}
            disabled={0 <= 0}
            onClick={() => {
              console.log("click");
            }}
          >
            <i>Deposit</i>
          </ActionButton>
        </ActionButtonContainer>
      </TroveFormContainer>
    </>
  );
};

export default Trove;
