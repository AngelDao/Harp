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
import { toWei } from "../../../utils/truncateString";
const RedeemModal = ({ isOpen, close, coll, debt }) => {
  const {
    contracts: { borrow },
    address,
    userTrove,
    userBalances,
  } = useContext(CredentialsContext);
  const [sending, setSending] = useState(false);

  // NEED HINT PARAMS
  const handleBorrow = async () => {
    const web3 = window.web3;

    if (parseFloat(userTrove.coll) > parseFloat(coll)) {
      // await borrow.methods
      //   .adjustTrove(address,,false,,,toWei(web3, "0.05"))
      //   .send({ from: address })
      //   .on("transactionHash", async () => {
      //     setSending(true);
      //   })
      //   .on("receipt", async () => {
      //     setSending(false);
      //   });
    } else {
      // await borrow.methods
      //   .openTrove(toWei(web3, "0.05"))
      //   .send({ from: address })
      //   .on("transactionHash", async () => {
      //     setSending(true);
      //   })
      //   .on("receipt", async () => {
      //     setSending(false);
      //   });
    }
  };

  return (
    <Modal
      borderRadius="0%"
      isOpen={isOpen}
      onClose={close}
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
          <ModalHeader textAlign="">Redeem</ModalHeader>

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
              You are redeeming <strong>{debt} LUSD</strong>.
            </p>
            <p style={{ marginTop: "25px" }}>
              You are recieving <strong>{coll} ETH</strong>
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

export default RedeemModal;
