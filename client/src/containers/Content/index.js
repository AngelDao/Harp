import React, { useContext } from "react";
import Loader from "../../components/Loader";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import DisconnectScreen from "../../components/DisconnectScreen";
import CredentialsContext from "../../context/credentialsContext";
import Farm from "../../components/Farm";
import FAQ from "../../components/FAQ";
import Stake from "../../components/Stake";
import Borrow from "../../components/Borrow";
import Redeem from "../../components/Redeem";
import Metamask from "../../components/Metamask";
import WarningModal from "../../components/Modal/WarningModal";

const Content = ({ location }) => {
  const {
    isConnected,
    loading,
    unsupported,
    hasAgreed,
    setHasAgreed,
    setIsConnected,
  } = useContext(CredentialsContext);

  if (loading) {
    return <Loader status={"LOADING"} />;
  }

  if (!window.web3) {
    return <Metamask />;
  }

  if (unsupported) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <span>
          Chain not supported, change chain to <strong>Mainnet</strong>,{" "}
          <strong>Kovan</strong>, or <strong>Rinkeby</strong>
        </span>
      </div>
    );
  }

  if (!isConnected) {
    return <DisconnectScreen />;
  }

  let warning = localStorage.getItem("warning");
  let diffHours = 0;
  try {
    warning = JSON.parse(warning);
  } catch (err) {
    console.error(err);
    warning = null;
  }

  if (warning && warning.agreed) {
    const date1 = new Date(new Date());
    const date2 = new Date(warning.lastFetch);
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  }

  console.log(warning, diffHours);

  return (
    <>
      {(!warning || !warning.agreed || diffHours > 6) && (
        <WarningModal
          isOpen={hasAgreed}
          handleAgree={setHasAgreed}
          onCancel={setIsConnected}
        />
      )}
      <div>
        <Switch location={location}>
          <Route exact path={`/borrow`} component={Borrow} />
          <Route exact path="/repay" component={Redeem} />
          <Route exact path="/stake" component={Stake} />
          <Route exact path="/farm" component={Farm} />
          <Route exact path="/faq" component={FAQ} />
          <Route>
            <Redirect to="/stake" />
          </Route>
        </Switch>
      </div>
    </>
  );
};

export default withRouter(Content);
