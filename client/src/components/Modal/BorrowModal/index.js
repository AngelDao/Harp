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

const BorrowModal = ({ isOpen, open, close, coll, cr, debt }) => {
  const {
    contracts: { borrow },
    address,
    userTrove,
    userBalances,
  } = useContext(CredentialsContext);
  const [sending, setSending] = useState(false);

  const handleBorrow = () => {
    const web3 = window.web3;
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
