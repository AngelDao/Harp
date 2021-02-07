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

const ActionModal = ({ open, close, balance, pair, contract }) => {
  const {
    contracts: { farm, profitShare },
    address,
    reFetchData,
  } = useContext(CredentialsContext);

  const pool = {
    "gSTRING/ETH": 0,
    "gSTRING/LUSD": 1,
  };

  const contractInstance = {
    profitShare,
    farm,
  };

  const handleClaim = async () => {
    await contractInstance[contract].methods
      .claim(pool[pair])
      .send({ from: address })
      .on("transactionHash", async () => {
        await reFetchData();
      })
      .on("receipt", async () => {
        await reFetchData();
      });
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
        <ModalBody
          borderTop="2px solid black"
          padding="25px 24px"
          textAlign="center"
        >
          <span>You have {balance} STRING ready to claim!</span>
        </ModalBody>
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
