import { Link, NavLink } from "react-router-dom";
import ToggleTheme from "components/common/ToggleTheme";
import { useTranslation } from "contexts/TranslationContext";
import { useUser } from "contexts/UserContext";
import { useConfig } from "contexts/ConfigContext";
import config from "models/config";

const TopNav = () => {

  const { __, language, languages, changeLanguage } = useTranslation();
  const { user, logout } = useUser();
  const { toggleConfig, runMode } = useConfig();

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      <Link data-ek="brand" className="navbar-brand ps-3" to="/admin/">{__('Admin')}|{config.appName}</Link>
      <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" onClick={() => { toggleConfig('sidebarOpened') }}><i className="fas fa-bars"></i></button>
      <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
        <div className="input-group">
          <input className="form-control" type="text" placeholder={__('Search for...')} aria-label={__('Search for...')} aria-describedby="btnNavbarSearch" />
          <button className="btn btn-primary" id="btnNavbarSearch" type="button"><i className="fas fa-search"></i></button>
        </div>
      </form>
      <ToggleTheme className="text-end" />
      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li className="nav-item dropdown">
          <Link data-ek="langDropdown" className="nav-link dropdown-toggle" id="navbarDropdown" href="#!" role="button" data-bs-toggle="dropdown" aria-expanded="false"><span className={"fi fi-" + languages[language].code}></span></Link>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            {Object.keys(languages).map((e, i) =>
              <li key={i}><Link data-ek={"langSelect" + e} className="dropdown-item" href="#!" onClick={() => { changeLanguage(e) }}><span className={"fi fi-" + languages[e].code}> </span> &nbsp;{__(languages[e].name)}</Link></li>
            )}
          </ul>
        </li>
      </ul>
      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li className="nav-item dropdown">
          <Link data-ek="userDropdown" className="nav-link dropdown-toggle" id="navbarDropdown" href="#!" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i>&nbsp;{user?.name ?? __('Guest')}</Link>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li><Link data-ek="settings" className="dropdown-item" href="#!">{__('Settings')}</Link></li>
            <li><Link data-ek="activityLog" className="dropdown-item" href="#!">{__('Activity Log')}</Link></li>
            {user && <li><NavLink data-ek="profile" className="dropdown-item" to="/admin/profile">{__('Profile')}</NavLink></li>}
            <li><hr className="dropdown-divider" /></li>
            {user && <li><Link data-ek="logout" className="dropdown-item" onClick={() => logout()}>{__('Logout')}</Link></li>}
            {!user && <li><Link data-ek="login" to="/admin/login" className="dropdown-item" >{__('Login')}</Link></li>}
          </ul>
        </li>
      </ul>
      {runMode() === 'DEV' && <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li className="nav-item"><Link className="nav-link" to="/">(pub)</Link></li>
      </ul>}
    </nav>
  );
};

export default TopNav;
