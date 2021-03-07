import React, { useState, useEffect, useContext } from "react";
import Loader from "../../components/Loader";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import DisconnectScreen from "../../components/DisconnectScreen";
import CredentialsContext from "../../context/credentialsContext";
import Farm from "../../components/Farm";
import FAQ from "../../components/FAQ";
import Stake from "../../components/Stake";

const Content = ({ location }) => {
  const { isConnected, loading } = useContext(CredentialsContext);
  // loading;
  if (loading) {
    return <Loader />;
  }

  if (!isConnected) {
    return <DisconnectScreen />;
  }

  return (
    <div>
      <Switch location={location}>
        <Route exact path="/borrow" />
        <Route exact path="/redeem" />
        <Route exact path="/stake" component={Stake} />
        <Route exact path="/farm" component={Farm} />
        <Route exact path="/faq" component={FAQ} />
        <Route exact path="*">
          <Redirect to="/borrow" />
        </Route>
      </Switch>
    </div>
  );
};

export default withRouter(Content);
