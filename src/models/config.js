/**
 * Alapbeállítások
 */

import { chooseLanguage } from "./MiscHelper";

const env = import.meta.env;
const baseURL = env.VITE_BASE_URL || 'http://slugs-n-shots.test/api/';
const guestServerURL = env.VITE_GUEST_SERVER_URL || `${baseURL}guest/`;
const staffServerURL = env.VITE_STAFF_SERVER_URL || `${baseURL}staff/`;

const config = {
    appName: env.VITE_APP_NAME || 'Slugs\'n\'Shots',
    currency: env.VITE_CURRENCY || 'Ft',
    lang: chooseLanguage() ?? env.VITE_DEFAULT_LANG,
    baseURL,
    user: null,
    guest: {
        serverURL: guestServerURL,
        theme: Number(env.VITE_GUEST_THEME ?? 0), // 0 sötét, 1 világos
    },
    staff: {
        serverURL: staffServerURL,
        sidebarOpened: env.VITE_STAFF_SIDEBAR_OPENED !== undefined
            ? env.VITE_STAFF_SIDEBAR_OPENED === 'true'
            : true,
        theme: Number(env.VITE_STAFF_THEME ?? 1), // 0 sötét, 1 világos
    }
};

export default config;
