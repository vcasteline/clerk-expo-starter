import React from "react";

export const AuthContext = React.createContext({
    auth: {
      isSignedIn: false,
    },
    setAuth: (auth) => {},
  });