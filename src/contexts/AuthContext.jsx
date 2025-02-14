import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [authId, setAuthId] = useState(() => localStorage.getItem("AuthId"));
  const [username, setUsername] = useState(() => localStorage.getItem("Username"));

  const updateUser = (id, name) => {
    if (id) {
      localStorage.setItem("AuthId", id);
      localStorage.setItem("Username", name);
    } else {
      localStorage.removeItem("AuthId");
      localStorage.removeItem("Username");
    }
    setAuthId(id);
    setUsername(name);
  };

  useEffect(() => {
    const syncUser = () => {
      setAuthId(localStorage.getItem("AuthId"));
      setUsername(localStorage.getItem("Username"));
    };
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  return (
    <UserContext.Provider value={{ authId, username, updateUser, clearUser: () => updateUser(null, null) }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};
