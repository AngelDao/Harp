import React from "react";

const CredentialsContext = React.createContext({});

export const CredentialsProvider = CredentialsContext.Provider;
export const CredentialsConsumer = CredentialsContext.Consumer;
export default CredentialsContext;
