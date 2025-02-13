import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [authId, setAuthId] = useState(() => localStorage.getItem("AuthId"));

  const updateUser = (id) => {
    if (id) {
      localStorage.setItem("AuthId", id);
    } else {
      localStorage.removeItem("AuthId");
    }
    setAuthId(id);
  };

  useEffect(() => {
    const syncUserId = () => setAuthId(localStorage.getItem("AuthId"));
    window.addEventListener("storage", syncUserId);
    return () => window.removeEventListener("storage", syncUserId);
  }, []);

  return (
    <UserContext.Provider value={{ authId, updateUser, clearUser: () => updateUser(null) }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AuthContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
