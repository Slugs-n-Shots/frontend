import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useConfig } from "./ConfigContext";
import translations_hu from "lang/hu";

const CONFIG_KEY_LANGUAGE = "language"
const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
    //const [language, setLanguage] = useState("en");
    const { getConfig, setConfig } = useConfig();
    const language = getConfig(CONFIG_KEY_LANGUAGE, "en");

    const languages = useMemo(() => ({
        "en": { name: "English", code: "gb", locale: "en-GB" },
        "hu": { name: "Hungarian", code: "hu", locale: "hu-HU" }
    }), [])

    const translations = useMemo(() => ({
        "hu": translations_hu
    }), []);

    const defaultLanguage = "hu";

    const changeLanguage = useCallback((newLang) => {
        if (newLang === "en" || translations[newLang]) {
            setConfig(CONFIG_KEY_LANGUAGE, newLang);
        }
    }, [setConfig, translations])

    const formatDate = useCallback((date, lang = language) => {
        const d = new Date(date);
        const locale = languages[lang]?.locale ?? languages[defaultLanguage].locale
        return d.toLocaleDateString(locale);
    }, [language, languages])

    const formatDateTime = useCallback((date, lang = language) => {
        const d = new Date(date);
        const locale = languages[lang]?.locale ?? languages[defaultLanguage].locale
        return d.toLocaleDateString(locale) + ' ' + d.toLocaleTimeString(locale);
    }, [language, languages])

    const formatNumber = useCallback((num, lang = language) => {
        const locale = languages[lang]?.locale ?? languages[defaultLanguage].locale
        return parseFloat(num).toLocaleString(locale);
    }, [language, languages])

    const __ = useCallback((text, replace = {}, lang = language) => {
        if (lang !== "en") {
            const translated = translations[lang]?.[text];
            if (!translated) {
                const existing = localStorage.getItem("missing_translations")
                let missing = existing ? JSON.parse(existing) : [];
                if (!missing.includes(text)) {
                    missing.push(text);
                    localStorage.setItem("missing_translations", JSON.stringify(missing))
                }
            }
            text = translated ?? text
        }
        if (replace) {
            return Object.keys(replace).reduce((carry, current) => carry.replace(new RegExp(`:${current}\\b`, "g"), replace[current]), text);
        } else {
            return text;
        }
    }, [language, translations])

    const formatAgo = useCallback((fmt, replace) => {
        if (language === 'hu') {
            const split = replace.time.split(" ")
            switch (split.pop()) {
                case 'nap':
                    split.push('napja')
                    break;
                case 'óra':
                    split.push('órája')
                    break;
                case 'perc':
                    split.push('perce')
                    break;
                case 'másodperc':
                    split.push('másodperce')
                    break;
                default:
            }
            return split.join(' ');
        } else {
            return __(':time ago', replace);
        }
    }, [__, language])

    const contextValue = useMemo(() => ({
        language,
        languages,
        __,
        changeLanguage,
        formatDate,
        formatDateTime,
        formatNumber,
        formatAgo
    }), [__, changeLanguage, formatAgo, formatDate, formatDateTime, formatNumber, language, languages]);

    return (
        <TranslationContext.Provider value={contextValue}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = () => useContext(TranslationContext);
