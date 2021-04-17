import React, { useEffect } from "react";
import { useLocation } from "react-router";

const UseRedirectToHttps = () => {
  let location = useLocation();
  useEffect(() => {
    debugger;
    if (
      window.location.protocol !== "https:" &&
      window.location.host === "app.harp.finance"
    ) {
      window.location.replace("https://app.harp.finance" + location.pathname);
    }
  });
};

export default UseRedirectToHttps;
