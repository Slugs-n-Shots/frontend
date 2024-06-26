import React, { createContext, useContext } from "react";
import { useConfig } from "./ConfigContext";
import translations_hu from "lang/hu";

const CONFIG_KEY_LANGUAGE = "language"
const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
    //const [language, setLanguage] = useState("en");
    const { getConfig, setConfig } = useConfig();
    const language = getConfig(CONFIG_KEY_LANGUAGE, "en");

    const languages = {
        "en": { name: "English", code: "gb", locale: "en-GB" },
        "hu": { name: "Hungarian", code: "hu", locale: "hu-HU" }
    }

    const translations = {
        "hu": translations_hu
    };

    const defaultLanguage = "hu";

    function changeLanguage(newLang) {
        if (newLang === "en" || translations[newLang]) {
            setConfig(CONFIG_KEY_LANGUAGE, newLang);
        }
    }

    function formatDate(date, lang = language) {
        const d = new Date(date);
        const locale = languages[lang]?.locale ?? languages[defaultLanguage].locale
        return d.toLocaleDateString(locale);
    }

    function formatDateTime(date, lang = language) {
        const d = new Date(date);
        const locale = languages[lang]?.locale ?? languages[defaultLanguage].locale
        return d.toLocaleDateString(locale) + ' ' + d.toLocaleTimeString(locale);
    }

    function formatNumber(num, lang = language) {
        const locale = languages[lang]?.locale ?? languages[defaultLanguage].locale
        return num.toLocaleString(locale)
    }


    function __(text, replace = {}, lang = language) {
        if (lang !== "en") {
            text = translations[lang][text] ?? text
            if (!translations[lang][text]) {
                const existing = localStorage.getItem("missing_translations")
                let missing = existing ? JSON.parse(existing) : [];
                // fs.appendFile("./logs/error_log.txt", text);
                if (!missing.includes(text)) {
                    missing.push(text);
                    localStorage.setItem("missing_translations", JSON.stringify(missing))
                }
                // console.warn(`No translation for: "${text}"`)
            }
        }
        if (replace) {
            return Object.keys(replace).reduce((carry, current) => carry.replace(new RegExp(`:${current}\\b`, "g"), replace[current]), text);
        } else {
            return text;
        }
    }

    function formatAgo(fmt, replace) {
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
    }

    return (
        <TranslationContext.Provider value={{
            language,
            languages,
            __,
            changeLanguage,
            formatDate,
            formatDateTime,
            formatNumber,
            formatAgo
        }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = () => useContext(TranslationContext);
