import React, { useState, useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  CloseContainer,
  HeaderContainer,
  ActionButton,
  ActionContainer,
} from "./styles";
import MasterStyles from "../../../utils/masterStyles";
import { toWei, fromWei, toDecimal } from "../../../utils/truncateString";
import CredentialsContext from "../../../context/credentialsContext";
import { Pair } from "../../Farm/Pool/styles";
import Loader from "../../Loader";

const ActionModal = ({
  open,
  close,
  balance,
  pair,
  contract,
  balance2,
  balance3,
  currencyEarned,
}) => {
  const {
    contracts: { farm, profitShare, proxy },
    address,
    reFetchData,
    sending,
    setSending,
  } = useContext(CredentialsContext);

  const pool = {
    "gSTRING/ETH": 0,
    "gSTRING/LUSD": 1,
  };

  const contractInstance = {
    profitShare,
    farm,
    factory: proxy,
  };

  const handleClaim = async () => {
    if (pair === "LQTY") {
      await contractInstance[contract].methods
        .unstake(0)
        .send({ from: address })
        .on("transactionHash", async () => {
          setSending(true);
        })
        .on("receipt", async () => {
          setSending(false);
          await reFetchData();
        });
      return;
    }

    if (pair === "STRING") {
      await contractInstance[contract].methods
        .withdraw(0)
        .send({ from: address })
        .on("transactionHash", async () => {
          setSending(true);
        })
        .on("receipt", async () => {
          setSending(false);
          await reFetchData();
        });
    }

    if (pair === "LUSD") {
      await contractInstance[contract].methods
        .claim()
        .send({ from: address })
        .on("transactionHash", async () => {
          setSending(true);
        })
        .on("receipt", async () => {
          setSending(false);
          await reFetchData();
        });
    } else {
      await contractInstance[contract].methods
        .claim(pool[pair])
        .send({ from: address })
        .on("transactionHash", async () => {
          setSending(true);
        })
        .on("receipt", async () => {
          setSending(false);
          await reFetchData();
        });
    }
    close();
  };

  return (
    <Modal borderRadius="0%" isOpen={open} onClose={close} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius="0%"
        border="3px solid black"
        backgroundColor={MasterStyles.background.menu}
      >
        <HeaderContainer>
          <ModalHeader textAlign="">Claim</ModalHeader>

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
          <ModalBody
            borderTop="2px solid black"
            padding="25px 24px"
            textAlign="center"
          >
            <p>You have {balance} STRING ready to claim!</p>
            {balance2 && (
              <p style={{ marginTop: "20px" }}>
                You have {balance2} {currencyEarned[1]} ready to claim!
              </p>
            )}
            {balance3 && (
              <p style={{ marginTop: "20px" }}>
                You have {balance3} {currencyEarned[2]} ready to claim!
              </p>
            )}
          </ModalBody>
        )}

        <ModalFooter paddingTop="0px">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ActionContainer>
              <ActionButton
                onClick={handleClaim}
                action={true}
                style={{ marginRight: "10px" }}
              >
                Claim
              </ActionButton>
              <ActionButton action={true} onClick={close}>
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
