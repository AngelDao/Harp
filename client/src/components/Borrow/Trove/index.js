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
import { TroveFormContainer, TroveRow } from "./styles";
import MasterStyles from "../../../utils/masterStyles";
import CredentialsContext from "../../../context/credentialsContext";

const Trove = ({}) => {
  const { web3DataProvider, farmBalances, prices } = useContext(
    CredentialsContext
  );

  const web3 = web3DataProvider;

  // TODO: replace place holders
  const ethBalance = "10";
  const lusdBalance = "1000";
  const type = "ETH";

  const [collateral, setCollateral] = useState(0);
  const [debt, setDebt] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [value, setValue] = useState(0);

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

  // TODO: change the values on the inputs

  return (
    <>
      <TroveFormContainer>
        <div style={{ marginTop: "12.5px", marginBottom: "12.5px" }}>
          <FormControl id="collateral" pt={2}>
            <TroveRow>
              <FormLabel>
                <span style={{ fontSize: MasterStyles.fontSize.large }}>
                  Collateral [ETH]
                </span>
              </FormLabel>
              <NumberInput
                onBlur={(e) => console.log(e.target.value)}
                onFocus={(e) => console.log(e.target.value)}
                defaultValue={0}
                min={0}
                precision={2}
                max={parseInt(ethBalance)}
                value={collateral}
                onChange={(str, num) => setCollateral(num)}
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
                onBlur={handleBlur}
                onFocus={handleFocus}
                defaultValue={0}
                min={0}
                precision={2}
                step={0.1}
                max={parseInt(lusdBalance)}
                value={debt}
                onChange={(str, num) => setDebt(num)}
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
                onBlur={handleBlur}
                onFocus={handleFocus}
                defaultValue={0}
                precision={2}
                max={parseInt(lusdBalance)}
                value={ratio}
                {...numberInputProps}
              >
                <NumberInputField {...numberInputFieldProps} />
              </NumberInput>
            </TroveRow>
          </FormControl>
        </div>
      </TroveFormContainer>
    </>
  );
};

export default Trove;
