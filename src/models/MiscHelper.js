const chooseLanguage = () => {
    const lang = (navigator.language || navigator.languages[0]).toLowerCase();

    if (['hu', 'en'].includes(lang)) {
        return lang;
    }

    if (['en-', 'en_'].includes(lang.substring(3))) {
        return lang.substring(2);
    }
    return null;
}

const validatePassword = (password) => {
    return password.trim().match(
        // 1 uppercase, 1 number, 1 special char (!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~), and minimum 8 chars length
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/

    );
}

const validateEmail = (email) => {
    return email.trim().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

export { chooseLanguage, validatePassword, validateEmail, capitalize };