
import React, { createContext, useContext } from 'react';
import { useConfig } from "contexts/ConfigContext";

const CONFIG_KEY_USER = 'user';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const { getConfig, setConfig, cleanupConfig, realm } = useConfig();

    const user = getConfig(CONFIG_KEY_USER, null);

    const USER_ROLES = {
        'waiter': 1,
        'bartender': 2,
        'backoffice': 3,
        'admin': 7,
    }

    const login = (userData) => {
        setConfig(CONFIG_KEY_USER, userData);
    };

    const logout = () => {
        cleanupConfig();
    };

    const userIsLoggedIn = () => user !== null && user !== undefined && (user.id ?? false);
    const userIsStaffMember = () => userIsLoggedIn() && user.hasOwnProperty('role_code') && realm === 'staff';

    const userHasRole = (role) => userIsStaffMember()
        && (USER_ROLES[role] !== undefined)
        && (user.role_code & USER_ROLES[role]) === USER_ROLES[role];

    // ha legalább az egyik jogoultsága megvan
    const userHasRoles = (roles) => roles.reduce((total, current) => total || userHasRole(current), false)

    return (
        <UserContext.Provider value={{
            user,
            login,
            logout,
            userIsLoggedIn,
            userIsStaffMember,
            userHasRole,
            userHasRoles,
        }}>
            {children}
        </UserContext.Provider>
    );

};

export const useUser = () => useContext(UserContext);
