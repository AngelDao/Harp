import React, { useState, useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";
import { HeaderContainer, ActionButton, ActionContainer } from "./styles";
import MasterStyles from "../../../utils/masterStyles";

const WarningModal = ({ isOpen, handleAgree, onCancel }) => {
  const [checkbox, setCheckbox] = useState(false);

  const handleCancel = () => {
    onCancel(false);
  };

  const handleClose = () => {
    if (checkbox) {
      localStorage.setItem(
        "warning",
        JSON.stringify({ agreed: true, lastFetch: new Date() })
      );
      handleAgree(true);
    }
  };

  const toggleCheckbox = () => {
    setCheckbox(!checkbox);
  };

  return (
    <Modal
      borderRadius="0%"
      isOpen={!isOpen}
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
          <ModalHeader textAlign="">Warning</ModalHeader>
        </HeaderContainer>

        <ModalBody
          borderTop="2px solid black"
          padding="25px 24px"
          // textAlign="center"
        >
          <p>
            This app uses some smart contracts that are{" "}
            <strong>unaudited</strong> and experimental, you could lose all your
            money. Please be careful. We will not compensate losses.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginTop: "40px",
            }}
          >
            <input
              type="checkbox"
              defaultChecked={false}
              onChange={toggleCheckbox}
              style={{ width: "20px", height: "20px", marginRight: "15px" }}
            />
            <p style={{ textAlign: "left" }}>
              I acknowledge and accept the risks of using Harp
            </p>
          </div>
        </ModalBody>

        <ModalFooter paddingTop="0px">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ActionContainer>
              <ActionButton
                action={true}
                onClick={handleClose}
                style={{ marginRight: "10px" }}
              >
                Agree
              </ActionButton>
              <ActionButton action={true} onClick={handleCancel}>
                Cancel
              </ActionButton>
            </ActionContainer>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WarningModal;
