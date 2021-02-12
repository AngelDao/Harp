import React, { useState, useEffect, useContext } from "react";
import Loader from "../../components/Loader";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import DisconnectScreen from "../../components/DisconnectScreen";
import CredentialsContext from "../../context/credentialsContext";
import Farm from "../../components/Farm";
import FAQ from "../../components/FAQ";
import Stake from "../../components/Stake";
import Borrow from "../../components/Borrow";

const Content = ({ location, loading }) => {
  const { isConnected } = useContext(CredentialsContext);

  if (loading) {
    return <Loader />;
  }

  if (!isConnected) {
    return <DisconnectScreen />;
  }

  return (
    <div>
      <Switch location={location}>
        <Route exact path="/borrow" component={Borrow} />
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
