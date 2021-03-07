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

const Loader = () => {
  const [currentSpin, setSpin] = useState("");
  const [loaderStyle, setLoaderStyle] = useState(null);
  const [animationSelection, setSelection] = useState(null);
  //   /\O    |    _O    |      O
  //   /\/   |   //|_   |     /_
  //  /\     |    |     |     |\
  // /  \    |   /|     |    / |
  // LOL  LOL  |   LLOL   |  LOLLOL

  const handleLoading = () => {
    var spins = [
      { animation: money, style: { w: "440px", h: "440px", fs: "20px" } },
      { animation: boomerang, style: { w: "285px", h: "190px", fs: "25px" } },
    ];

    const num = rand(0, spins.length - 1);

    const spin = spins[num];
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
    <ComponentContainer>
      <LoadingContainer>
        <StyledText
          value={currentSpin}
          w={loaderStyle && loaderStyle.w}
          h={loaderStyle && loaderStyle.h}
          fs={loaderStyle && loaderStyle.fs}
        ></StyledText>
      </LoadingContainer>
      <LoadingText
        style={{
          marginTop: animationSelection === 1 ? "-95px" : "20px",
        }}
      >
        <i>LOADING</i>
      </LoadingText>
    </ComponentContainer>
  );
};

export default Loader;
