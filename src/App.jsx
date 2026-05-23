import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { useUser } from "contexts/UserContext";

import Login from "components/common/Login";
import Dashboard from "components/common/Dashboard";
import PublicPageLayout from "components/public/layout/PublicPageLayout";
import Home from "components/public/Home";
import AdminPageLayout from "components/admin/layout/AdminPageLayout";
import NoPage from "components/common/NoPage";

import adminRoutes from "routes/adminRoutes";
import publicRoutes from "routes/publicRoutes";

const componentModules = import.meta.glob([
  "./components/**/*.{js,jsx}",
  "!./components/**/*.test.{js,jsx}",
  "!./components/**/*.spec.{js,jsx}",
], { eager: true });

function getRouteComponent(component) {
  return componentModules[`./components/${component}.jsx`]?.default
    ?? componentModules[`./components/${component}.js`]?.default;
}

function App() {
  const { user } = useUser();
  document.body.classList.add('sb-nav-fixed');

  function checkStaffRoles(user, roles, path) {
    /**
     * igaz feltételeket kell vaggyal (||) összekapcsolni.
     */
    const roleMatches = (bit) => user && (user.role_code & bit) === bit;

    let res = (roles.length === 0) //  Nincsenek szabályok (mindenki használhatja)
      || (roles.includes('all')) //  Nincsenek szabályok (mindenki használhatja)
      || (roles.includes('unauth') && !user) // ha nincs bejelentkezett user
      || (roles.includes('auth') && user) // ha van belentkezett user (mindegy milyen szerep)
      || (roles.includes('waiter') && roleMatches(1)) // ha van belentkezett user és az user waiter
      || (roles.includes('bartender') && roleMatches(2)) // ha van belentkezett user és az user bartender
      || (roles.includes('backoffice') && roleMatches(4)) // ha van belentkezett user és az user backoffice
      || (roles.includes('admin') && roleMatches(7)) // ha van belentkezett user és az user admin
    // console.log('checkStaffRoles:', user, roles, path, res)
    return res;
  }

  function checkGuest(user, roles, path) {

    /**
     * igaz feltételeket kell vaggyal (||) összekapcsolni.
     */
    let res = (roles.length === 0) //  Nincsenek szabályok (mindenki használhatja)
      || (roles.includes('all')) //  Nincsenek szabályok (mindenki használhatja)
      || (roles.includes('unauth') && !user) // ha nincs bejelentkezett user
      || (roles.includes('auth') && user) // ha van belentkezett user

    // console.log('checkGuestRoles:', user, roles, path, res)
    return res;
  }

  return (
    <Routes>
      <Route path="/admin" element={<AdminPageLayout />}  >
        <Route index element={<Dashboard />} />
        {adminRoutes.map((route, index) => {
          const Component = getRouteComponent(route.component);
          return checkStaffRoles(user, route.roles, route.path) && Component && <Route key={index} path={route.path} element={<Component />} />
        })}
        {user ? <Route path="*" element={<NoPage redir="/admin/" />} />
          : <Route path="*" element={<Login />} />}
      </Route>
      <Route path="/" element={<PublicPageLayout />}  >
        <Route index element={<Home />} />
        {publicRoutes.map((route, index) => {
          const Component = getRouteComponent(route.component);
          return checkGuest(user, route.roles, route.path) && Component && <Route key={index} path={route.path} element={<Component />} />
        })}
        {user ? <Route path="*" element={<NoPage redir="/" />} />
          : <Route path="*" element={<Login />} />}
      </Route>
    </Routes>
  );
}

export default App;
