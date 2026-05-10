import React from 'react';
import "bootstrap/dist/js/bootstrap";
import "./index.css";
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "contexts/ThemeContext";
import { TranslationProvider } from "contexts/TranslationContext";
import { UserProvider } from "contexts/UserContext";
import { MessagesProvider } from "contexts/MessagesContext";
import { ConfigProvider } from "./contexts/ConfigContext";
import { ApiProvider } from "./contexts/ApiContext";
import App from "./App";
import "flag-icons/css/flag-icons.min.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
// <> React.StrictMode
// </> React.StrictMode
root.render(
  <ConfigProvider>
    <Router>
      <TranslationProvider>
        <ApiProvider>
          <UserProvider>
            <ThemeProvider>
              <MessagesProvider>
                <App />
              </MessagesProvider>
            </ThemeProvider>
          </UserProvider>
        </ApiProvider>
      </TranslationProvider>
    </Router>
  </ConfigProvider>
);
