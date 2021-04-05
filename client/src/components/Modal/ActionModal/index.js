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
import Loader from "../../Loader";
import Body from "./body";

const ActionModal = ({
  open,
  close,
  type,
  balance,
  allowance,
  pair,
  contract,
  gSTRINGAllowance,
}) => {
  const {
    contracts: {
      proxy,
      farm,
      stringToken,
      ETHLPToken,
      LUSDLPToken,
      lusdToken,
      profitShare,
      gStringToken,
      factory,
      lqtyToken,
      rewards,
    },
    address,
    setUserAllowances,
    userAllowances,
    web3DataProvider,
    web3UserProvider,
    reFetchData,
    userBalances,
    rewardsBalances,
    profitShareBalances,
    farmBalances,
    factoryBalances,
    proxyBalances,
    sending,
    setSending,
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
    gSTRING: gStringToken,
    LQTY: lqtyToken,
  };

  const pairNames = {
    "gSTRING/ETH": "gSTRING_ETH_LP",
    "gSTRING/LUSD": "gSTRING_LUSD_LP",
    STRING: "STRING",
    LUSD: "LUSD",
    LQTY: "LQTY",
  };

  const contractBals = {
    farm: farmBalances,
    profitShare: profitShareBalances,
    rewards: rewardsBalances,
    factory: factoryBalances,
    proxy: proxyBalances,
  };

  const contractInstance = {
    farm,
    profitShare,
    factory,
    proxy,
    rewards,
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

  const handleDeployProxy = async () => {
    await factory.methods
      .createStabilityProxy()
      .send({ from: address })
      .on("transactionHash", async () => {
        setSending(true);
      })
      .on("receipt", async () => {
        setSending(false);
        await reFetchData();
      });

    handleClose();
  };

  const handleOverflowDep = () => {
    const web3 = web3DataProvider;
    const BN = web3.utils.BN;
    let val = web3.utils.toWei(value.toString());
    let val2 = web3.utils.toWei(
      userBalances[pair === "STRING" ? "gSTRING" : pairNames[pair]]
    );

    val = new BN(val);
    val2 = new BN(val2);

    if (type === "Deposit" && pair === "STRING") {
      val2 = web3.utils.toWei(userBalances["STRING"]);
      if (val.gt(val2)) {
        return val2.toString();
      } else {
        return val.toString();
      }
    }

    if (val.gt(val2)) {
      return val2.toString();
    } else {
      return val.toString();
    }
  };

  const handleOverflowWith = () => {
    const web3 = web3DataProvider;
    const BN = web3.utils.BN;
    let val = web3.utils.toWei(value.toString());
    let contractSel = contractBals[contract === "factory" ? "proxy" : contract];
    let val2;
    if (pair === "STRING") {
      val2 = web3.utils.toWei(userBalances["gSTRING"]);
    } else {
      val2 = web3.utils.toWei(contractSel.userStaked[pair]);
    }

    val = new BN(val);
    val2 = new BN(val2);

    if (val.gt(val2)) {
      return val2.toString();
    } else {
      return val.toString();
    }
  };

  const handleApprove = async () => {
    let contractAddress;
    if (contract === "farm") {
      contractAddress = farm._address;
    } else if (contract === "factory" && proxy) {
      contractAddress = proxy._address;
    } else if (contract === "factory" && !proxy) {
      contractAddress = factory._address;
    } else if (contract === "profitShare") {
      contractAddress = profitShare._address;
    } else if (contract === "rewards") {
      contractAddress = rewards._address;
    }

    let ctrct;

    if (type === "Withdraw" && contract === "profitShare") {
      ctrct = token["gSTRING"];
    } else {
      ctrct = token[pair];
    }
    await ctrct.methods
      .approve(contractAddress, toWei(web3DataProvider, "10000000000000"))
      .send({ from: address })
      .on("sent", async () => {})
      .on("transactionHash", async () => {
        setSending(true);
      })
      .on("receipt", async () => {
        setSending(false);
        await reFetchData();
      });
    handleClose();
  };

  const handleDeposit = async () => {
    const val = handleOverflowDep();

    const web3 = web3DataProvider;

    const ctrct =
      contract === "factory"
        ? contractInstance["proxy"]
        : contractInstance[contract];
    const param1 = contract === "farm" && pair !== "LUSD" ? pool[pair] : val;

    const param2 = val;

    if (contract === "rewards") {
      await ctrct.methods
        .stake(param1)
        .send({ from: address })
        .once("sent", async () => {})
        .on("transactionHash", async () => {
          setSending(true);
        })
        .on("receipt", async () => {
          setSending(false);
          await reFetchData();
        });

      return;
    }
    if (contract === "profitShare" || contract === "factory") {
      try {
        await ctrct.methods
          .deposit(param1)
          .send({ from: address })
          .once("sent", async () => {})
          .on("transactionHash", async () => {
            setSending(true);
          })
          .on("receipt", async () => {
            setSending(false);
            await reFetchData();
          });
      } catch (err) {
        console.error(err.message);
      }
    } else {
      try {
        await ctrct.methods
          .deposit(param1, param2)
          .send({ from: address })
          .once("sent", async () => {})
          .on("transactionHash", async () => {
            setSending(true);
          })
          .on("receipt", async () => {
            setSending(false);
            await reFetchData();
          });
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  const handleWithdraw = async () => {
    const val = handleOverflowWith();
    const web3 = web3DataProvider;

    const ctrct =
      contract === "factory"
        ? contractInstance["proxy"]
        : contractInstance[contract];

    const param1 = contract === "farm" && pair !== "LUSD" ? pool[pair] : val;
    const param2 = val;

    if (contract === "rewards") {
      await ctrct.methods
        .unstake(param1)
        .send({ from: address })
        .once("sent", async () => {})
        .on("transactionHash", async () => {
          setSending(true);
        })
        .on("receipt", async () => {
          setSending(false);
          await reFetchData();
        });

      return;
    }

    if (contract === "profitShare" || contract === "factory") {
      try {
        await ctrct.methods
          .withdraw(param1)
          .send({ from: address })
          .on("sent", async () => {})
          .on("transactionHash", async () => {
            setSending(true);
          })
          .on("receipt", async () => {
            setSending(false);
            await reFetchData();
          });
      } catch (err) {
        console.error(err.message);
      }
    } else {
      await ctrct.methods
        .withdraw(param1, param2)
        .send({ from: address })
        .on("sent", async () => {})
        .on("transactionHash", async () => {
          setSending(true);
        })
        .on("receipt", async () => {
          setSending(false);
          await reFetchData();
        });
    }
  };

  const handleAction = async () => {
    switch (type) {
      case "Deposit":
        await handleDeposit();
        handleClose();
        break;
      case "Withdraw":
        await handleWithdraw();
        handleClose();
    }
  };

  let allowed;

  if (pair === "STRING") {
    const { gSTRING } = userBalances;

    if (type === "Deposit") {
      allowed = parseFloat(balance) < parseFloat(allowance);
    } else if (type === "Withdraw") {
      allowed =
        parseFloat(balance) < parseFloat(allowance) &&
        parseFloat(gSTRING) < parseFloat(gSTRINGAllowance);
    }
  } else if (pair === "LUSD") {
    allowed = proxy ? parseFloat(balance) < parseFloat(allowance) : false;
  } else {
    allowed = parseFloat(balance) < parseFloat(allowance);
  }

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
        {sending ? (
          <ModalBody
            borderTop="2px solid black"
            padding="25px 24px"
            textAlign="center"
          >
            <Loader status={"SENDING"} />
          </ModalBody>
        ) : (
          <Body
            pair={pair}
            handleBlur={handleBlur}
            handleSetMax={handleSetMax}
            allowed={allowed}
            type={type}
            balance={balance}
            handleFocus={handleFocus}
            value={value}
            handleChangeValue={handleChangeValue}
            gSTRING={gSTRING}
            proxy={proxy}
          />
        )}

        <ModalFooter paddingTop="0px">
          <div style={{ display: "flex", flexDirection: "column" }}>
            {!sending && (
              <ActionContainer>
                {allowed ? (
                  <ActionButton
                    onClick={handleAction}
                    action={true}
                    style={{ marginRight: "10px" }}
                  >
                    {type}
                  </ActionButton>
                ) : pair === "LUSD" && !proxy ? (
                  <ActionButton
                    onClick={handleDeployProxy}
                    action={true}
                    style={{ marginRight: "10px", width: "120px" }}
                  >
                    Create Proxy
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
            )}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ActionModal;
