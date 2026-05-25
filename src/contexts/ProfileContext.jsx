import React, { createContext, useContext, useState } from "react";
import { useApi } from "./ApiContext";
import { useConfig } from "./ConfigContext";
import { useMessages } from "./MessagesContext";
import { guestEndpoints, staffEndpoints } from "src/api";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { get, deleteX } = useApi();
  const { realm } = useConfig();
  const { addMessage } = useMessages();
  const [displayUser, setDisplayUser] = useState(null);
  const endpoints = realm === 'staff' ? staffEndpoints : guestEndpoints;


  const getMe = () => {
    get(endpoints.me)
      .then((response) => {
        const user = response.data;
        setDisplayUser(user);
      })
      .catch((error) => {
        setDisplayUser(null);
        addMessage("danger", error.response.data.error);
      });
  };

  const deleteUser = () => {
    deleteX(endpoints.me)
      .then(() => {
        console.log("User deleted successfully");
        setDisplayUser(null);
        addMessage("success", "User deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting user", error);
        addMessage("danger", "Error deleting user. Please try again.");
      });
  };

  return (
    <ProfileContext.Provider
      value={{
        displayUser,
        getMe,
        deleteUser
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
