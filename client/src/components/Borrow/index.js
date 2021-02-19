import React, { useState, useContext } from "react";
import Trove from "./Trove";
import { BorrowContainer, Title, TroveContainer } from "./styles";
import CredentialsContext from "../../context/credentialsContext";

const Borrow = () => {
  const [trove, setTrove] = useState({
    collateral: 0,
    debt: 0,
    ratio: 0,
  }); // TODO: replace w/ actual drove data
  const ethPrice = 1000; // TODO: replace with oracle
  const minDebt = 10; // TODO: replace with minimum lusd debt
  const minRatio = 110; // collateral ratio must be above 110%

  const { web3DataProvider, farmBalances, prices, userBalances } = useContext(
    CredentialsContext
  );
  const web3 = web3DataProvider;

  return (
    <BorrowContainer>
      <Title>My Trove</Title>
      <TroveContainer>
        <Trove
          trove={trove}
          setTrove={setTrove}
          ethPrice={ethPrice}
          userBalances={userBalances}
          minDebt={minDebt}
          minRatio={minRatio}
        />
      </TroveContainer>
    </BorrowContainer>
  );
};

export default Borrow;
