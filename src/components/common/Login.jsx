import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useTranslation } from "contexts/TranslationContext";
import { useUser } from "contexts/UserContext";
// import { useTheme } from 'contexts/ThemeContext';
import { useMessages } from "contexts/MessagesContext";
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useApi } from "contexts/ApiContext";
import { useConfig } from "contexts/ConfigContext";

const Login = () => {
  const { __ } = useTranslation();
  const { user, login, /*role_code , logout*/ } = useUser();
  //  const { user, login, /* role, logout*/ } = useUser();
  const { addMessage } = useMessages();
  const { post } = useApi();
  const navigate = useNavigate();
  const { realm, realm_path } = useConfig();

  // State variables to store email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    console.log(user.role_code);
    navigate("/");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Here you can perform validation, authentication, etc.

    post("login", { email: email, password: password })
      .then((response) => {
        console.log('success', response)
        const user = response.data.user;
        console.log(user);
        login(user);
        navigate(realm_path + "/");
      })
      .catch((error) => {
        console.warn(error);
        addMessage("danger", error.statusText);
      });
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={5}>
          <Card className="shadow-lg border-0 rounded-lg mt-5">
            <Card.Header>
              <h3 className="text-center font-weight-light my-4">
                {__("Login")}
              </h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={__("Email address")}
                  />
                  <Form.Label>{__("Email address")}</Form.Label>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={__("Password")}
                  />
                  <Form.Label>{__("Password")}</Form.Label>
                </Form.Group>
                <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                  <Link className="small" to={`${realm_path}/password`}>
                    {__("Forgot Password?")}
                  </Link>
                  <Button type="submit" variant="primary">{__("Login")}</Button>
                </div>
              </Form>
            </Card.Body>
            {realm === 'guest' &&
              <Card.Footer className="card-footer text-center py-3">
                <div className="small">
                  <Link to={realm_path + "/register"}>{__("Need an account? Sign up!")}</Link>
                </div>
              </Card.Footer>
            }

          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
