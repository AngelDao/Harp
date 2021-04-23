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
import { toWei, fromWei } from "../../../utils/truncateString";
import { createHintforRepay } from "../../../utils/handleHints";

const RedeemModal = ({ isOpen, close, coll, debt, toClose }) => {
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
  const handleRepay = async () => {
    const web3 = window.web3;

    const [
      upperHint,
      lowerHint,
      debtChange,
      collatChange,
    ] = await createHintforRepay(
      web3,
      hintHelpers,
      sortedTroves,
      userTrove,
      debt,
      coll
    );

    if (
      !toClose &&
      parseFloat(fromWei(web3, userTrove.coll)) > parseFloat(coll)
    ) {
      await borrow.methods
        .adjustTrove(
          toWei(web3, "0.05"),
          collatChange,
          debtChange,
          false,
          upperHint,
          lowerHint
        )
        .send({ from: address })
        .on("transactionHash", async () => {
          setSending(true);
        })
        .on("receipt", async () => {
          setSending(false);
          close();
        });
    } else {
      await borrow.methods
        .closeTrove()
        .send({ from: address })
        .on("transactionHash", async () => {
          setSending(true);
        })
        .on("receipt", async () => {
          setSending(false);
          close();
        });
    }
  };

  const web3 = window.web3;

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
          <ModalHeader textAlign="">Repay</ModalHeader>

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
            {!toClose ? (
              <>
                <p>
                  You are repayig <strong>{debt} LUSD</strong>.
                </p>
                <p style={{ marginTop: "25px" }}>
                  You are recieving <strong>{coll} ETH</strong>
                </p>
                {parseFloat(fromWei(web3, userTrove.coll)).toFixed(4) ===
                  parseFloat(coll).toFixed(4) && (
                  <p style={{ marginTop: "25px" }}>
                    <strong>
                      Doing this will result in you closing your Trove!
                    </strong>
                  </p>
                )}
              </>
            ) : (
              <p>
                Are you sure you want to close your Trove? This means all your
                debt will be paid off and your collateral will be returned to
                your wallet
              </p>
            )}
          </ModalBody>
        )}

        {!sending && (
          <ModalFooter paddingTop="0px">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <ActionContainer>
                <ActionButton
                  onClick={handleRepay}
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

export default RedeemModal;
