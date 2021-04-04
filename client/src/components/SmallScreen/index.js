import React from "react";
import Logo from "../../assets/harpLogo.png";
import { Parent } from "./styles";
import MasterStyles from "../../utils/masterStyles";

const SmallScreen = () => {
  return (
    <Parent>
      <div
        style={{
          maxWidth: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
        }}
      >
        <img style={{ maxWidth: "300px", height: "auto" }} src={Logo} />
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "80%",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: MasterStyles.fontSize.large }}>
            Harp is desktop only, mobile and tablet support coming{" "}
            <strong>soon™</strong>
          </span>
        </div>
      </div>
    </Parent>
  );
};

export default SmallScreen;
