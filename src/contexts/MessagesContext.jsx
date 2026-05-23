import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import shortid from 'shortid';

const MessagesContext = createContext();

export const MessagesProvider = ({ children }) => {

    const [messages, setMessages] = useState({});

    const addMessage = useCallback((type, message, args = {}, options = {}) => {

        // típusok: primary,secondary,success,danger,warning,info,light,dark
        // ha más néven akarsz használni kategóriákat, itt adhatsz meg behelyettesítéseket.
        const typeMappings = {
            error: "danger",
            warn: "warning",
        };
        type = typeMappings[type] ? typeMappings[type] : type;

        const guid = shortid.generate();
        setMessages((prevItems) => {
            return { ...prevItems, [guid]: { type, message, args, options } };
        });
    }, []);

    const removeMessage = useCallback((key) => {
        setMessages((current) => {
            const copy = { ...current };
            delete copy[key];
            return copy;
        });
    }, [])

    const contextValue = useMemo(() => ({ messages, addMessage, removeMessage }), [addMessage, messages, removeMessage]);

    return (
        <MessagesContext.Provider value={contextValue}>
            {children}
        </MessagesContext.Provider>
    );
};

export const useMessages = () => useContext(MessagesContext);
