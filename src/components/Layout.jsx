import { Outlet, Link } from "react-router-dom";

import { useTranslation } from "../contexts/TranslationContext";
import { useUser } from "../contexts/UserContext";
import MessageArea from "./MessageArea.jsx";
import ToggleTheme from "./ToggleTheme.jsx";

// import { useTheme } from '../contexts/ThemeContext';



const Layout = () => {
  const { __ } = useTranslation();
  const { user /*, login, logout*/ } = useUser(); // || {};
  // const { theme } = useTheme();
  return (
    <>
      <main>
        <header>Booze Now</header>
      </main>

      <nav className="navbar navbar-expand-lg " style={{ display: "flex" }}>
        {/* <a className="navbar-brand" href="#">Navbar</a> */}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                {__("Dashboard")}
              </Link>
            </li>
            {!user && (
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  {__("Register")}
                </Link>
              </li>
            )}
            {!user &&(
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  {__("Log in")}
                </Link>
              </li>
            )}{" "}
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/logout">
                  {__("Logout")}
                </Link>
              </li>
            )}
          </ul>
          <ToggleTheme className="text-end" />

          {/* <li className="nav-item dropdown ml-auto">
              <a className="nav-link dropdown-toggle"
                 id="navbarDropdownMenuLink" role="button"
                 data-toggle="dropdown" aria-expanded="false">
                Dropdown link
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <li>
                  <a className="dropdown-item" href="https://www.w3docs.com/learn-html.html">Books</a>
                </li>
                <li>
                  <a className="dropdown-item" href="https://www.w3docs.com/snippets">Snippets</a>
                </li>
                <li>
                  <a className="dropdown-item" href="https://www.w3docs.com/quiz/">Quizzes</a>
                </li>
              </ul>
            </li> */}

        </div>
      </nav>
      <MessageArea />
      <article>
        <Outlet />
      </article>
      <footer>Booze Now</footer>
    </>
  );
};

export default Layout;
