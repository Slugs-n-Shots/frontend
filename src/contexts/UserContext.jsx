
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useConfig } from "contexts/ConfigContext";

export const CONFIG_KEY_USER = 'user';
const USER_ROLES = {
    'waiter': 1,
    'bartender': 2,
    'backoffice': 4,
    'admin': 7,
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const { getConfig, setConfig, cleanupConfig, realm } = useConfig();

    const user = getConfig(CONFIG_KEY_USER, null);

    const login = useCallback((userData) => {
        setConfig(CONFIG_KEY_USER, userData);
    }, [setConfig]);

    const logout = useCallback(() => {
        cleanupConfig();
    }, [cleanupConfig]);

    const userIsLoggedIn = useCallback(() => user != null && user.id != null, [user]);
    const userIsStaffMember = useCallback(
        () => user != null && user.id != null && user.hasOwnProperty('role_code') && realm === 'staff',
        [realm, user]
    );

    const userHasRole = useCallback((role) => userIsStaffMember()
        && (USER_ROLES[role] !== undefined)
        && (user.role_code & USER_ROLES[role]) === USER_ROLES[role], [user, userIsStaffMember]);

    // ha legalább az egyik jogosultsága megvan
    const userHasRoles = useCallback((roles) => roles.some(userHasRole), [userHasRole])

    const contextValue = useMemo(() => ({
        user,
        login,
        logout,
        userIsLoggedIn,
        userIsStaffMember,
        userHasRole,
        userHasRoles,
    }), [login, logout, user, userHasRole, userHasRoles, userIsLoggedIn, userIsStaffMember]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );

};

export const useUser = () => useContext(UserContext);
