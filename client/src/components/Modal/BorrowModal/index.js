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
import Loader from "../../Loader";
import MasterStyles from "../../../utils/masterStyles";
import CredentialsContext from "../../../context/credentialsContext";
import { createHintforBorrow } from "../../../utils/handleHints";
import { toWei } from "../../../utils/truncateString";

const BorrowModal = ({ isOpen, open, close, coll, cr, debt }) => {
  const {
    contracts: { borrow, hintHelpers, sortedTroves },
    address,
    userTrove,
    userBalances,
    troves,
    prices,
  } = useContext(CredentialsContext);
  const [sending, setSending] = useState(false);

  // NEED HINT PARAMS
  const handleBorrow = async () => {
    const web3 = window.web3;

    const [
      upperHint,
      lowerHint,
      debtChange,
      collatChange,
    ] = await createHintforBorrow(
      web3,
      hintHelpers,
      sortedTroves,
      userTrove,
      debt,
      coll
    );

    if (parseFloat(userTrove.coll) > 0) {
      await borrow.methods
        .adjustTrove(
          toWei(web3, "0.05"),
          toWei(web3, "0"),
          debtChange,
          true,
          upperHint,
          lowerHint
        )
        .send({ from: address, value: collatChange })
        .on("sent", async () => {})
        .on("transactionHash", async () => {
          setSending(true);
        })
        .on("receipt", async () => {
          setSending(false);
          close();
        });
    } else {
      await borrow.methods
        .openTrove(toWei(web3, "0.05"), debtChange, upperHint, lowerHint)
        .send({ from: address, value: collatChange })
        .on("sent", async () => {})
        .on("transactionHash", async () => {
          setSending(true);
        })
        .on("receipt", async () => {
          setSending(false);
          close();
        });
    }
  };

  const handleClose = () => {
    setSending(false);
    close();
  };

  return (
    <Modal
      borderRadius="0%"
      isOpen={isOpen}
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
          <ModalHeader textAlign="">Borrow</ModalHeader>

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
            <p>
              You are borrowing <strong>{debt} LUSD</strong> as debt.
            </p>
            <p style={{ marginTop: "25px" }}>
              You are putting up <strong>{coll} ETH</strong> as collateral for
              your debt.
            </p>
            <p style={{ marginTop: "25px" }}>
              This will result in a Collateralization Ratio(CR) of{" "}
              <strong>{cr}%</strong>(collateral/debt). If your CR falls below
              110% you run the risk of being liquidated are you sure you want to
              confirm?
            </p>
          </ModalBody>
        )}

        {!sending && (
          <ModalFooter paddingTop="0px">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <ActionContainer>
                <ActionButton
                  onClick={handleBorrow}
                  action={true}
                  style={{ marginRight: "10px" }}
                >
                  Confirm
                </ActionButton>
                <ActionButton action={true} onClick={close}>
                  Cancel
                </ActionButton>
              </ActionContainer>
            </div>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BorrowModal;
