import React, { useRef, useState } from "react";
import "./Register.2.css";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "contexts/TranslationContext";
import { Button, Form, Row } from "react-bootstrap";
import { useApi } from "contexts/ApiContext";
import { useMessages } from "contexts/MessagesContext";
import { validatePassword, validateEmail } from "models/MiscHelper";

export default function Register() {
  const navigate = useNavigate();
  const { addMessage } = useMessages();
  const { __ } = useTranslation();
  const { post } = useApi();

  const [validated, setValidated] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPasswords, setShowPasswords] = useState(false);

  const [firstName, setFirstName] = useState({ value: '', msg: '', touched: false, valid: false });
  const [lastName, setLastName] = useState({ value: '', msg: '', touched: false, valid: false });
  const [email, setEmail] = useState({ value: '', msg: '', touched: false, valid: false });
  const [password, setPassword] = useState({ value: '', msg: '', touched: false, valid: false });
  const [passwordConfirm, setPasswordConfirm] = useState({ value: '', msg: '', touched: false, valid: false });
  const inputRef = useRef();

  const toggleShowPasswords = (event) => {
    setShowPasswords((prev) => {
      return event.target.checked; // !prev
    })
  }

  const handleSubmit = (event) => {
    // const form = event.currentTarget;
    // if (form.checkValidity() === false) {
    //   event.preventDefault();
    //   event.stopPropagation();
    // }
    post('register',
      {
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
        password: password.value,
      })
      .then((response) => {
        addMessage("success", response.data.message);
        navigate('/login')
      })
      .catch((error) => {
        console.warn(error);
        addMessage("danger", error.statusText);
      });

    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
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

  const validateAsPassword = (field, newValue, options) => {
    let [needToUpdate, updated] = validateGeneral(field, newValue, options);
    let { value, msg, touched, valid } = updated;

    if (msg.length === 0) {
      if (!validatePassword(newValue.trim())) {
        msg = __('The :field is invalid', [options.name])
      }
    }
    if (msg.length === 0) {
      if (options.confirm && options.confirm !== newValue) {
        msg = __('The :field needs to be match Password', [options.name])
      }
    }

    valid = msg.trim().length === 0;
    needToUpdate = needToUpdate || value !== field.value || msg !== field.msg || touched !== field.touched || valid !== field.valid
    return [needToUpdate, { value: value, msg: msg, touched: touched, valid: valid }]
  }

  const handleChange = (e) => {
    switch (e.target.id) {
      case 'inputFirstName':
        const [updFirstName, firstNameValidated] = validateGeneral(firstName, e.target.value, { name: "First Name", required: true, minLength: 3, maxLength: 20 });
        if (updFirstName) {
          setFirstName((prev) => firstNameValidated)
        }
        break;
      case 'inputLastName':
        const [updLastName, lastNameValidated] = validateGeneral(lastName, e.target.value, { name: "Last Name", required: true, minLength: 3, maxLength: 20 });
        if (updLastName) {
          setLastName((prev) => lastNameValidated)
        }
        break;
      case 'inputEmail':
        const [updEmail, emailValidated] = validateAsEmail(email, e.target.value, { name: "Email", required: true, minLength: 3, maxLength: 60 });
        if (updEmail) {
          setEmail((prev) => emailValidated)
        }
        break;
      case 'inputPassword':
        const [updPassword, passwordValidated] = validateAsPassword(password, e.target.value, { name: "Password", required: true, maxLength: 60 });
        if (updPassword) {
          setPassword((prev) => passwordValidated)
          setPasswordsMatch(e.target.value === passwordConfirm.value)
        }
        break;
      case 'inputPasswordConfirm':
        const [updPasswordConfirm, passwordConfirmValidated] = validateAsPassword(passwordConfirm, e.target.value, { name: "Confirm Password", required: true, minLength: 8, maxLength: 60 });
        if (updPasswordConfirm) {
          setPasswordConfirm((prev) => passwordConfirmValidated)
          setPasswordsMatch(e.target.value === password.value)
        }
        break;
      default: ;
    }
  }

  const passwordMatchError = (passwordsMatch) ? '' : __('Passwords should match')

  const formIsValid = !!passwordsMatch &&
    firstName.touched && firstName.valid &&
    lastName.touched && lastName.valid &&
    email.touched && email.valid &&
    password.touched && password.valid &&
    passwordConfirm.touched && passwordConfirm.valid

  return (
    <div className="container">
      <Row className="justify-content-center">
        <div className="col-lg-7">
          <div className="card shadow-lg border-0 rounded-lg mt-5">
            <div className="card-header"><h3 className="text-center font-weight-light my-4">{__('Create Account')}</h3></div>
            <div className="card-body">
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <div className="col-md-6">
                    <Form.Group className="form-floating mb-3 mb-md-0">
                      <Form.Control id="inputFirstName" value={firstName.value}
                        onChange={handleChange}
                        type="text" placeholder={__('Enter your first name')} required
                        isInvalid={firstName.touched && !firstName.valid}
                        isValid={firstName.touched && firstName.valid}
                        ref={inputRef}
                      />
                      <Form.Label htmlFor="inputFirstName">{__('First name')}</Form.Label>
                      <Form.Control.Feedback {...(firstName.touched && !firstName.valid) && { type: 'invalid' }}>
                        {__(firstName.msg, { field: __('First Name') })}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="form-floating">
                      <Form.Control id="inputLastName" value={lastName.value}
                        onChange={handleChange}
                        type="text" placeholder={__('Enter your last name')} required
                        isInvalid={lastName.touched && !lastName.valid}
                        isValid={lastName.touched && lastName.valid} />
                      <Form.Label htmlFor="inputLastName">{__('Last name')}</Form.Label>
                      <Form.Control.Feedback {...(lastName.touched && !lastName.valid) && { type: 'invalid' }}>
                        {__(lastName.msg, { field: __('Last Name') })}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </Row>
                <Form.Group className="form-floating mb-3">
                  <Form.Control id="inputEmail" value={email.value}
                    onChange={handleChange}
                    type="email" placeholder="name@example.com" required
                    isInvalid={email.touched && !email.valid}
                    isValid={email.touched && email.valid} />
                  <Form.Label htmlFor="inputEmail">{__('Email address')}</Form.Label>
                  <Form.Control.Feedback {...(email.touched && !email.valid) && { type: 'invalid' }}>
                    {__(email.msg, { field: __('Email') })}
                  </Form.Control.Feedback>
                </Form.Group>
                <Row className="mb-3">
                  <div className="col-md-6">
                    <Form.Group className="form-floating mb-3 mb-md-0">
                      <Form.Control id="inputPassword" value={password.value ?? ''}
                        onChange={handleChange}
                        type={showPasswords ? "text" : "password"} placeholder={__('Create a password')}
                        isInvalid={password.touched && !password.valid}
                        isValid={password.touched && password.valid} />
                      <Form.Label htmlFor="inputPassword">{__('Password')}</Form.Label>
                      <Form.Control.Feedback {...(password.touched && !password.valid) && { type: 'invalid' }}>
                        {__(password.msg, { field: __('Password') })}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="form-floating mb-3 mb-md-0">
                      <Form.Control id="inputPasswordConfirm" value={passwordConfirm.value ?? ''}
                        onChange={handleChange}
                        type={showPasswords ? "text" : "password"} placeholder={__('Confirm password')}
                        isInvalid={passwordConfirm.touched && (!passwordsMatch || !passwordConfirm.valid)}
                        isValid={passwordConfirm.touched && passwordsMatch && passwordConfirm.valid} />
                      <Form.Label htmlFor="inputPasswordConfirm">{__('Confirm Password')}</Form.Label>
                      <Form.Control.Feedback {...(passwordConfirm.touched && (!passwordsMatch || !passwordConfirm.valid)) && { type: 'invalid' }}>
                        {passwordMatchError ? passwordMatchError : __(passwordConfirm.msg, { field: __('Confirm Password') })}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="form-floating mb-3 mb-md-0">
                      <Form.Check id="inputShowPasswords" checked={showPasswords}
                        onChange={toggleShowPasswords}
                        type="checkbox" label={__('Show Passwords')}
                      />
                    </Form.Group>
                  </div>
                </Row>
                <div className="mt-4 mb-0">
                  <div className="d-grid"><Button {...(formIsValid ? {} : { disabled: true })} type="submit" className=" btn-primary btn-block" >{__('Create Account')}</Button></div>
                </div>
              </Form>
            </div>
            <div className="card-footer text-center py-3">
              <div className="small"><Link to="/login">{__('Have an account? Go to login')}</Link></div>
              <div className="small"><Link to="/resend-registration">{__('Confirmation email missing? Resend it now!')}</Link></div>
            </div>
          </div>
        </div>
      </Row>
    </div>
  );
}

