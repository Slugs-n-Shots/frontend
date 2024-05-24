/**
 * Alapbeállítások
 */

import { chooseLanguage } from "./MiscHelper";

const baseURL = 'http://localhost:8000/api/';

const config = {
    appName: 'Slugs\'n\'Shots',
    currency: 'Ft',
    lang: chooseLanguage() ?? 'hu',
    baseURL: baseURL,
    user: null,
    guest: {
        serverURL: baseURL + 'guest/', // a záró / jel kell a végére
        theme: 0, // 0 sötét, 1 világos
    },
    staff: {
        serverURL: baseURL + 'staff/', // a záró / jel kell a végére
        sidebarOpened: true,
        theme: 1, // 0 sötét, 1 világos
    }
};

export default config;