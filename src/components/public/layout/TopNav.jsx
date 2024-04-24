import { Link, NavLink } from "react-router-dom";
import ToggleTheme from "components/common/ToggleTheme.jsx";
import { useTranslation } from "contexts/TranslationContext.js";
import { useUser } from "contexts/UserContext.js";
// import { useConfig } from "contexts/ConfigContext.js";
import config from "models/config";

const TopNav = () => {
  const { __, language, languages, changeLanguage } = useTranslation();
  const { user, logout } = useUser();
  // const { toggleConfig } = useConfig();

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      <Link data-ek="brand" className="navbar-brand ps-3" to="/">
        {config.appName}
      </Link>
      <ul className="navbar-nav ms-auto me-3">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="#?"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Menu
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li>
              <Link className="dropdown-item" to="/drinks">
                Drinks
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/shopping-cart">
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/about-us">
                About Us
              </Link>
            </li>
          </ul>
        </li>
      </ul>

      <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
        <div
          className="input-group"
          style={{ maxWidth: "300px", paddingTop: "10px" }}
        >
          <input
            className="form-control"
            type="text"
            placeholder={__("Search for...")}
            aria-label={__("Search for...")}
            aria-describedby="btnNavbarSearch"
          />
          <button
            className="btn btn-primary"
            id="btnNavbarSearch"
            type="button"
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
      </form>
      <ToggleTheme className="text-end" />
      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li className="nav-item dropdown">
          <Link
            data-ek="langDropdown"
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            href="#!"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className={"fi fi-" + languages[language].code}></span>
          </Link>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="navbarDropdown"
          >
            {Object.keys(languages).map((e, i) => (
              <li key={i}>
                <Link
                  data-ek={"langSelect" + e}
                  className="dropdown-item"
                  href="#!"
                  onClick={() => {
                    changeLanguage(e);
                  }}
                >
                  <span className={"fi fi-" + languages[e].code}> </span> &nbsp;
                  {__(languages[e].name)}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>

      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        {!user ? ( // Render login link if user is not logged in
          <li className="nav-item">
            <Link data-ek="login" to="/login" className="nav-link">
              {__("Login")}
            </Link>
          </li>
        ) : ( // Render user dropdown if user is logged in
          <li className="nav-item dropdown">
            <Link
              className="nav-link dropdown-toggle"
              to="#"
              id="navbarDropdownUserLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-user fa-fw"></i>&nbsp;
              {user.first_name ?? __("Guest")}
            </Link>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownUserLink">
              <li>
                <Link className="dropdown-item" to="/orders">
                  {__("Orders")}
                </Link>
              </li>
              <li>
                <NavLink className="dropdown-item" to="/profile">
                  {__("Profile")}
                </NavLink>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item" onClick={() => logout()}>
                  {__("Logout")}
                </button>
              </li>
            </ul>
          </li>
        )}
      </ul>
      <ul>
        <li>
          <Link
            to="/shopping-cart"
            className="nav-link"
            title={__("Shopping-cart")}
          >
            {" "}
            <i className="fa-solid fa-basket-shopping"></i>
          </Link>{" "}
        </li>
      </ul>
      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li className="nav-item">
          <Link className="nav-link" to="/admin/">
            (adm)
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default TopNav;
