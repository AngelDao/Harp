import React, { useState, useContext, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tooltip,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
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
  const [buttonText, setButtonText] = useState();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [newTrove, setNewTrove] = useState(true);
  // TODO: replace place holders
  const ethBalance = "10";
  const lusdBalance = userBalances.LUSD;

  // const { web3DataProvider, farmBalances, prices } = useContext(
  //   CredentialsContext
  // );
  // const web3 = web3DataProvider;

  // determine if the user has a trove open or not
  useEffect(() => {
    // setNewTrove(false);
  }, [newTrove]);

  // TODO: this only covers the cases if a trove hasn't been created
  useEffect(() => {
    let text = "";
    if (newTrove) {
      if (trove.collateral > 0) {
        text = `Deposit ${trove.collateral} ETH`;
        setButtonDisabled(false);
      }
      if (trove.debt > minDebt) {
        text += ` & Borrow ${trove.debt - minDebt} LUSD`;
      }
      if (trove.debt < minDebt) {
        text = "Need at least 10 LUSD for gas compensation";
        setButtonDisabled(true);
      }
      if (trove.ratio < minRatio) {
        text = "Collateral ratio must at least be 110%";
        setButtonDisabled(true);
      }
    } else {
      text = `Different text for existing trove`;
    }

    setButtonText(text);
  }, [trove]);

  const handleRatioValidity = (ratio) => {
    if (ratio < minRatio) setRatioValidity(false);
    else setRatioValidity(true);
  };

  const calculateRatio = (eth, lusd) => {
    return ((eth * ethPrice) / lusd) * 100;
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

  const handleClick = () => {
    console.log("click");
    console.log(trove);
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
              <span
                style={{
                  fontSize: MasterStyles.fontSize.large,
                  paddingRight: "6px",
                }}
              >
                Collateral [ETH]
              </span>
              <Tooltip
                label="The ETH you deposit to make LUSD loan"
                placement="right"
              >
                <InfoIcon w={3} h={3} />
              </Tooltip>
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
              <span
                style={{
                  fontSize: MasterStyles.fontSize.large,
                  paddingRight: "6px",
                }}
              >
                Debt [LUSD]
              </span>
              <Tooltip
                label="The LUSD you have borrowed from Liquity"
                placement="right"
              >
                <InfoIcon w={3} h={3} />
              </Tooltip>
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
              <span
                style={{
                  fontSize: MasterStyles.fontSize.large,
                  paddingRight: "6px",
                }}
              >
                Collateral Ratio
              </span>
              <Tooltip
                label="Your Debt:Collateral ratio. If this falls below 110%, your collateral can be liquidated."
                placement="right"
              >
                <InfoIcon w={3} h={3} />
              </Tooltip>
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
            action={!buttonDisabled}
            disabled={buttonDisabled}
            onClick={handleClick}
          >
            <i>{buttonText}</i>
          </ActionButton>
        </ActionButtonContainer>
      </TroveFormContainer>
    </>
  );
};

export default Trove;
