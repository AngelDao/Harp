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
  //   /\O    |    _O    |      O
  //   /\/   |   //|_   |     /_
  //  /\     |    |     |     |\
  // /  \    |   /|     |    / |
  // LOL  LOL  |   LLOL   |  LOLLOL

  const handleLoading = () => {
    var spins = [
      { animation: money, style: { w: "440px", h: "340px", fs: "20px" } },
      { animation: boomerang, style: { w: "275px", h: "165px", fs: "25px" } },
    ];

    let spin = spins[rand(0, spins.length - 1)];
    setLoaderStyle(spin.style);
    let i = 0;

    setInterval(function () {
      i = i == spin.animation.length - 1 ? 0 : ++i;
      setSpin(spin.animation[i]);
    }, 300);
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
      <LoadingText>
        <i>LOADING</i>
      </LoadingText>
    </ComponentContainer>
  );
};

export default Loader;
