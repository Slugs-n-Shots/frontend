import React, { useEffect, useState } from "react";

import { useTranslation } from "contexts/TranslationContext";
import { useMessages } from "contexts/MessagesContext";
import { Alert, Fade } from "react-bootstrap";

import "./MessageArea.css";


const MessageArea = () => {
  const { __ } = useTranslation();
  const { messages, removeMessage } = useMessages();

  return (
    <>
      <div id="messageArea">
        {Object.keys(messages).map((key) => (

          <TimedAlert
            key={key}
            variant={messages[key].type}
            onClose={() => {
              removeMessage(key);
            }}
            transition={Fade.in}
            dismissible
            timeOut={messages[key].options?.timeOut }
          >
            {__(messages[key].message, messages[key].args)}
          </TimedAlert>
        ))}
      </div>
    </>
  );
};

const TimedAlert = (props) => {

  const [show, setShow] = useState(props.show ?? true);
  const {timeOut, ...alertProps} = { ...props, show }

  useEffect(() => {
    if (timeOut !== undefined) {
      const timer = window.setTimeout(() => { setShow(false); }, timeOut)
      return () => window.clearTimeout(timer);
    }
  }, [timeOut])

  return (
    <Alert {...alertProps} >{props.children}</Alert>
  );
}

export default MessageArea;
