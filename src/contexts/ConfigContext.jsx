import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import config from "../models/config";

const ConfigContext = createContext();
const CONFIG_KEYS = {
    'guest': 'config',
    'staff': 'config-staff'
};
const REALM_PATHS = {
    'guest': '',
    'staff': '/admin'
};

const detectInitialRealm = () => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        return 'staff';
    }
    return 'guest';
};

export const ConfigProvider = ({ children }) => {

    const [realm, setRealm] = useState(detectInitialRealm);

    const configKey = CONFIG_KEYS[realm] ?? '';

    const [items, setItems] = useState(() => {
        // LOAD
        let items = {};
        Object.keys(CONFIG_KEYS).forEach((key) => {
            const lsKey = CONFIG_KEYS[key];
            const lsItems = localStorage.getItem(lsKey);
            if (lsItems != null) {
                items[key] = JSON.parse(lsItems)
            }
        });
        // console.log('Items loaded from localStorage', items)
        return items ?? {};
    });

    // console.log('items', items)

    const applyStaffRealm = useCallback(() => {
        // console.log('applyRealm', 'staff')
        setRealm('staff')
    }, [])

    const applyGuestRealm = useCallback(() => {
        // console.log('applyRealm', 'guest')
        setRealm('guest')
    }, [])

    const getConfig = useCallback((key, defaultValue = null) => {
        const ret = (realm ? (items.hasOwnProperty(realm) ? (items[realm][key] ?? null) : null) : null)
            ?? (realm ? (config.hasOwnProperty(realm) ? (config[realm][key] ?? null) : null) : null)
            ?? defaultValue;

        if (!realm) {
            console.warn('getConfig: no realm', key, ret)
            // } else {
            //     console.log('getConfig', realm, key, ret)
        }
        return ret;
    }, [items, realm])

    const setConfig = useCallback((key, newValue) => {
        setItems((prevItems) => {
            const newItems = { ...prevItems }
            if (realm) {
                const realmItems = { ...(newItems[realm] ?? {}) };
                if (newValue !== null) {
                    realmItems[key] = newValue;
                } else {
                    delete realmItems[key];
                }
                newItems[realm] = realmItems;
            }
            return newItems;
        });
    }, [realm])

    useEffect(() => {
        // console.log('saving to localStorage', items);
        Object.keys(CONFIG_KEYS).forEach((key) => {
            const lsKey = CONFIG_KEYS[key];
            const lsItems = items[key];
            if (lsItems != null) {
                localStorage.setItem(lsKey, JSON.stringify(lsItems));
                // console.log("- writing", lsKey, lsItems);
            } else {
                localStorage.removeItem(lsKey);
                // console.log("- writing?", key, items);
            }
        });
    }, [configKey, items]);

    const toggleConfig = useCallback((key) => {
        const value = !getConfig(key)
        // console.log('toggle', key, value);
        setConfig(key, value);
    }, [getConfig, setConfig])

    const cleanupConfig = useCallback(() => {
        setItems((prevItems) => {
            let newItems = { ...prevItems }
            delete newItems[realm]
            return newItems;
        });
        // console.log('cleanup', realm, configKey)
    }, [realm])

    const runMode = useCallback(() => {
        return 'DEV';
    }, [])

    const realm_path = REALM_PATHS[realm] ?? undefined;
    const contextValue = useMemo(() => ({
        getConfig,
        setConfig,
        toggleConfig,
        cleanupConfig,
        realm,
        realm_path,
        applyStaffRealm,
        applyGuestRealm,
        runMode
    }), [applyGuestRealm, applyStaffRealm, cleanupConfig, getConfig, realm, realm_path, runMode, setConfig, toggleConfig]);

    return (
        <ConfigContext.Provider value={contextValue}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => useContext(ConfigContext);
