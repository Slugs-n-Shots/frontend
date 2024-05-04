import { useApi } from "contexts/ApiContext";
import { useConfig } from "contexts/ConfigContext";
import { useMessages } from "contexts/MessagesContext";
import { useTranslation } from "contexts/TranslationContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ConfirmRegistration = () => {

    const { id, token } = useParams();
    const { post } = useApi();
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState('');
    const { __ } = useTranslation();
    const { addMessage } = useMessages();
    const { realm } = useConfig();

    useEffect(() => {
        if (realm && !confirmed && !error) {
            let data = { id: id, token: token }
            post('/confirm-registration', data)
                .then((response) => {
                    setConfirmed(true);
                }).catch((error) => {
                    console.warn(error)
                    setError(error.statusText)
                    addMessage("danger", error.statusText);
                })
        }
    })

    return (
        <div>
            <h2>{__('Registration Confirmed!')}</h2>
            {!confirmed ? <p>{__('Finalizing registration, please wait.')}</p> : <p>{__('Now you can log in.')}</p>}
        </div>
    )
}

export default ConfirmRegistration;