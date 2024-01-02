import { createContext, useEffect, useState } from "react";

const INITIAL_STATE = {
  currentUser: JSON.parse(localStorage.getItem("user") || null),
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(INITIAL_STATE.currentUser);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  const values = {
    currentUser,
    setCurrentUser,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContext;
