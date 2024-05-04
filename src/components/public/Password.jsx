import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "contexts/TranslationContext";
import './register.css';
import { useApi } from "contexts/ApiContext";
import { useMessages } from "contexts/MessagesContext";
import { validateEmail } from "models/MiscHelper";
import { useConfig } from "contexts/ConfigContext";



const Password = () => {
  const navigate = useNavigate();
  const { __ } = useTranslation();
  const { post } = useApi();
  const { addMessage } = useMessages();
  const { realm, realm_path } = useConfig();

  const [email, setEmail] = useState({ value: '', msg: '', touched: false, valid: false });


  const handleSubmit = (event) => {
    event.preventDefault();
    // Your submit logic here
    post('forgot-password', { email: email.value })
      .then((response) => {
        addMessage("info", response.data.message);
        navigate(realm_path + '/login')
      })
      .catch((error) => {
        console.warn(error);
        addMessage("danger", error.statusText);
      });
  };

  const validateGeneral = (field, newValue, options) => {

    let { value, msg, touched, valid } = field;
    newValue = newValue.trim()
    touched = touched || newValue.length > 0;
    if (options.required && newValue === '') {
      msg = __('The :field is a required data', [options.name])
    } else if (options.minLength && newValue.length > 0 && newValue.length < options.minLength) {
      msg = __('The :field is too short', [options.name])
    } else if (options.maxLength && newValue.length > options.maxLength) {
      msg = __('The :field is too long', [options.name])
    } else {
      msg = ''
    }
    valid = msg.trim().length === 0;
    const needToUpdate = newValue !== value || msg !== field.msg || touched !== field.touched || valid !== field.valid
    return [needToUpdate, { value: newValue, msg: msg, touched: touched, valid: valid }]
  }

  const validateAsEmail = (field, newValue, options) => {

    let [needToUpdate, updated] = validateGeneral(field, newValue, options);
    let { value, msg, touched, valid } = updated;

    if (msg.length === 0) {
      const result = validateEmail(newValue.trim());
      if (!result) {
        msg = __('The :field is invalid', [options.name])
      }
    }

    valid = msg.trim().length === 0;
    needToUpdate = needToUpdate || value !== field.value || msg !== field.msg || touched !== field.touched || valid !== field.valid
    return [needToUpdate, { value: value, msg: msg, touched: touched, valid: valid }]
  }

  const handleChange = (e) => {
    switch (e.target.id) {
      case 'inputEmail':
        const [updEmail, emailValidated] = validateAsEmail(email, e.target.value, { name: "Email", required: true, minLength: 3, maxLength: 60 });
        if (updEmail) {
          setEmail((prev) => emailValidated)
        }
        break;
      default: ;
    }
  }

  const formIsValid = email.touched && email.valid

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={5}>
          <Card className="shadow-lg border-0 rounded-lg mt-5">
            <Card.Header>
              <h3 className="text-center font-weight-light my-4">
                {__('Password Recovery')}
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="small mb-3 text-muted">
                {__('Enter your email address and we will send you a link to reset your password.')}
              </div>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="inputEmail">
                  <Form.Control value={email.value}
                    onChange={handleChange}
                    type="email" placeholder="name@example.com" />
                  <Form.Label>{__('Email address')}</Form.Label>
                  <Form.Control.Feedback {...(email.touched && !email.valid) && { type: 'invalid' }}>
                    {__(email.msg, { field: __('Email') })}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                  <Link className="small" to={realm_path + "/login"}>
                    {__('Return to login')}
                  </Link>
                  <Button variant="primary" type="submit" {...(formIsValid ? {} : { disabled: true })} className="btn-block" >{__('Reset Password')}</Button>
                </div>
              </Form>
            </Card.Body>
            {realm === 'guest' &&
            <Card.Footer className="text-center py-3">
              <div className="small">
                  <Link to="/register">{__('Need an account? Sign up!')}</Link>
              </div>
            </Card.Footer>
            }
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Password;
