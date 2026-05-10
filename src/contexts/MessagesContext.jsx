import React, { createContext, useContext, useState } from 'react';
import shortid from 'shortid';

const MessagesContext = createContext();

export const MessagesProvider = ({ children }) => {

    const [messages, setMessages] = useState({});

    const addMessage = (type, message, args = {}, options = {}) => {

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
    };

    const removeMessage = (key) => {
        const copy = { ...messages };
        delete copy[key];
        setMessages(copy);
    }

    return (
        <MessagesContext.Provider value={{ messages, addMessage, removeMessage }}>
            {children}
        </MessagesContext.Provider>
    );
};

export const useMessages = () => useContext(MessagesContext);
