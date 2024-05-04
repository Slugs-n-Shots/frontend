import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import "./Register.2.css";
import { useTranslation } from "contexts/TranslationContext";
import { Button, Form, Row } from "react-bootstrap";
import { useApi } from "contexts/ApiContext";
import { useMessages } from "contexts/MessagesContext";
import { validatePassword } from "models/MiscHelper";
//import { useConfig } from "contexts/ConfigContext";


const ResetPassword = () => {

  const { addMessage } = useMessages();
  const { __ } = useTranslation();
  const { post } = useApi();

  const navigate = useNavigate();

  //const { realm_path } = useConfig();


  const [validated, setValidated] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPasswords, setShowPasswords] = useState(false);

  const [password, setPassword] = useState({ value: '', msg: '', touched: false, valid: false });
  const [passwordConfirm, setPasswordConfirm] = useState({ value: '', msg: '', touched: false, valid: false });

  const { id, token } = useParams();

  const toggleShowPasswords = (event) => {
    setShowPasswords((prev) => {
      return event.target.checked;
    })
  }

  const handleSubmit = (event) => {
    post('reset-password',
      {
        id: id,
        token: token,
        password: password.value
      })
      .then((response) => {
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
    password.touched && password.valid &&
    passwordConfirm.touched && passwordConfirm.valid

  return (
    <div className="container">

      <Row className="justify-content-center">
        <div className="col-lg-7">
          <div className="card shadow-lg border-0 rounded-lg mt-5">
            <div className="card-header"><h3 className="text-center font-weight-light my-4">{__('Reset Password')}</h3></div>
            <div className="card-body">
              <div>
                <br />
                <p>id: {id}</p>
                <p>token: #{token}</p>
              </div>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                  <div className="d-grid"><Button {...(formIsValid ? {} : { disabled: true })} type="submit" className=" btn-primary btn-block" >{__('Reset Password')}</Button></div>
                </div>
              </Form>
            </div>
            {/* <div className="card-footer text-center py-3">
              <div className="small"><Link to={realm_path + "/login"}>{__('Have an account? Go to login')}</Link></div>
            </div> */}
          </div>
        </div>
      </Row>
    </div>
  );
}

export default ResetPassword;
