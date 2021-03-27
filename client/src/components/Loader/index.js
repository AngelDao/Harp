import React, { useState, useEffect } from "react";
import {
  LoadingContainer,
  StyledText,
  LoadingText,
  ComponentContainer,
} from "./styles";
import { boomerang } from "./animations/boomerang";
import { money } from "./animations/money";
import { rand } from "../../utils/randomNumbers";
import MasterStyles from "../../utils/masterStyles";

const Loader = ({ status }) => {
  const [currentSpin, setSpin] = useState("");
  const [loaderStyle, setLoaderStyle] = useState(null);
  const [animationSelection, setSelection] = useState(null);
  //   /\O    |    _O    |      O
  //   /\/   |   //|_   |     /_
  //  /\     |    |     |     |\
  // /  \    |   /|     |    / |
  // LOL  LOL  |   LLOL   |  LOLLOL

  const handleLoading = () => {
    var spins = {
      LOADING: {
        animation: money,
        style: { w: "490px", h: "440px", fs: "20px" },
      },
      SENDING: {
        animation: boomerang,
        style: { w: "235px", h: "150px", fs: "18px" },
      },
    };

    const num = rand(0, spins.length - 1);

    const spin = spins[status];
    setLoaderStyle(spin.style);
    setSelection(num);

    let i = 0;

    setInterval(function () {
      i = i == spin.animation.length - 1 ? 0 : ++i;
      setSpin(spin.animation[i]);
    }, 200);
  };

  useEffect(() => {
    if (currentSpin === "" && !loaderStyle) {
      console.log("enter");
      handleLoading();
    }
  });

  return (
    <ComponentContainer style={{ marginTop: status === "SENDING" && "0px" }}>
      <LoadingContainer status={status}>
        <StyledText
          value={currentSpin}
          w={loaderStyle && loaderStyle.w}
          h={loaderStyle && loaderStyle.h}
          fs={loaderStyle && loaderStyle.fs}
        ></StyledText>
      </LoadingContainer>
      <LoadingText
        status={status}
        style={{
          marginTop: status === "SENDING" ? "-15px" : "20px",
        }}
      >
        <i>{status}</i>
      </LoadingText>
    </ComponentContainer>
  );
};

export default Loader;
