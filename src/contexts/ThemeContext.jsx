import React, { createContext, useContext } from 'react';
import { useConfig } from './ConfigContext';

const CONFIG_KEY_THEME = 'theme'
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

    const {getConfig, toggleConfig} = useConfig();
    const theme = getConfig(CONFIG_KEY_THEME, 0)
    // const classList = document.documentElement.classList;
    const doc = document.documentElement;

    if (!theme) {
        doc.setAttribute('data-bs-theme', 'dark')
        // classList.add("dark-theme");
        // classList.remove("light-theme");
    } else {
        doc.setAttribute('data-bs-theme', 'light')
        // classList.remove("dark-theme");
        // classList.add("light-theme");
    }

    // console.log(CONFIG_KEY_THEME, theme);

    const toggleTheme = () => {
        toggleConfig(CONFIG_KEY_THEME);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
