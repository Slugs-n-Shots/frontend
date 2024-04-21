import React, { createContext, useContext } from 'react';
import { useConfig } from './ConfigContext.js';
// import translations from 'lang/hu.js';
import translations_hu from 'lang/hu.js';

const CONFIG_KEY_LANGUAGE = 'language'
const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
    //const [language, setLanguage] = useState('en');
    const { getConfig, setConfig } = useConfig();
    const language = getConfig(CONFIG_KEY_LANGUAGE, 'en');

    const languages = {
        "en": { name: "English", code: "gb" },
        "hu": { name: "Hungarian", code: "hu" }
    }

    const translations = {
        'hu': translations_hu
    };

    function changeLanguage(newLang) {
        if (newLang === "en" || translations[newLang]) {
            setConfig(CONFIG_KEY_LANGUAGE, newLang);
        }
    }

    function __(text, replace = {}, lang = language) {
        if (lang !== 'en') {
            text = translations[lang][text] ?? text
            if (!translations[lang][text]) {
                const existing = localStorage.getItem('missing_translations')
                let missing = existing ? JSON.parse(existing) : [];
                // fs.appendFile('./logs/error_log.txt', text);
                if (!missing.includes(text)) {
                    missing.push(text);
                    localStorage.setItem('missing_translations', JSON.stringify(missing))
                }
                // console.warn(`No translation for: "${text}"`)
            }
        }
        if (replace) {
            return Object.keys(replace).reduce((carry, current) => carry.replace(new RegExp(`:${current}\\b`, 'g'), replace[current]), text);
        } else {
            return text;
        }
    }

    return (
        <TranslationContext.Provider value={{ language, languages, __, changeLanguage }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = () => useContext(TranslationContext);
