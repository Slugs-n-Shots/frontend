import { Link, NavLink } from "react-router-dom";
import ToggleTheme from "components/common/ToggleTheme.jsx";
import { useTranslation } from "contexts/TranslationContext";
import { useUser } from "contexts/UserContext";
// import { useConfig } from "contexts/ConfigContext";
import config from "models/config";

const TopNav = () => {
  const { __, language, languages, changeLanguage } = useTranslation();
  const { user, logout } = useUser();
  // const { toggleConfig } = useConfig();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link data-ek="brand" className="navbar-brand ps-3" to="/">
          {config.appName}
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
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
                {__('Menu')}
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" to="/drinks">
                    {__('Drinks')}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/shopping-cart">
                    {__('Shopping Cart')}
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/about-us">
                    {__('About Us')}
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
          <li className="nav-item dropdown">
            <Link
              data-ek="userDropdown"
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              href="#!"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-user fa-fw"></i>&nbsp;
              {user?.first_name ?? __("Guest")}
            </Link>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdown"
            >
              <li>
                <Link
                  data-ek="Orders"
                  className="dropdown-item"
                  href="#!"
                  to="orders"
                >
                  {__("Orders")}
                </Link>
              </li>
              {user && (
                <li>
                  <NavLink
                    data-ek="profile"
                    className="dropdown-item"
                    to="profile"
                  >
                    {__("Profile")}
                  </NavLink>
                </li>
              )}
              <li>
                <hr className="dropdown-divider" />
              </li>
              {user && (
                <li>
                  <Link
                    data-ek="logout"
                    className="dropdown-item"
                    onClick={() => logout()}
                  >
                    {__("Logout")}
                  </Link>
                </li>
              )}
              {!user && (
                <li>
                  <Link data-ek="login" to="login" className="dropdown-item">
                    {__("Login")}
                  </Link>
                </li>
              )}
            </ul>
          </li>
          <li>
            <Link to="/shopping-cart" className="nav-link" title={__('Shopping Cart')}>
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
      </div>
      </div>
    </nav>
  );
};

export default TopNav;
