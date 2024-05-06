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
            timeOut={messages[key].options?.timeOut ?? false}
          >
            {__(messages[key].message, messages[key].args)}
          </TimedAlert>
        ))}
      </div>
    </>
  );
};

const TimedAlert = (props) => {

  const [show, setShow] = useState(props.show);

  useEffect(() => {
    if (props?.timeOut) {
      window.setTimeout(() => { setShow(false); }, props?.timeOut)
    }
  })
  const alertProps = { ...props, show }

  return (
    <Alert {...alertProps} >{props.children}</Alert>
  );
}

export default MessageArea;
