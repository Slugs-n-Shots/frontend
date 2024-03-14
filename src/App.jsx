import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { useUser } from "./contexts/UserContext.js";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PublicPageLayout from "./layoutElements/public/PublicPageLayout.jsx";
import AdminPageLayout from "./layoutElements/admin/AdminPageLayout.jsx";
import NoPage from "./components/NoPage";

import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

function App() {
  const { user } = useUser();
  document.body.classList.add('sb-nav-fixed');

  function checkStaffRoles(user, roles, path) {
    /**
     * igaz feltételeket kell vaggyal (||) összekapcsolni.
     */

    let res = (roles.length === 0) //  Nincsenek szabályok (mindenki használhatja)
      || (roles.includes('all')) //  Nincsenek szabályok (mindenki használhatja)
      || (roles.includes('unauth') && !user) // ha nincs bejelentkezett user
      || (roles.includes('auth') && user) // ha van belentkezett user (mindegy milyen szerep)
      || (roles.includes('bartender') && user && user.role_id === 1) // ha van belentkezett user és az user bartender
      || (roles.includes('waiter') && user && user.role_id === 0) // ha van belentkezett user és az user waiter
      || (roles.includes('backoffice') && user && user.role_id === 2) // ha van belentkezett user és az user backoffice
      || (roles.includes('admin') && user && user.role_id === 3) // ha van belentkezett user és az user admin

    console.log('checkStaffRoles:', user, roles, path, res)
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

    console.log('checkGuestRoles:', user, roles, path, res)
    return res;
  }

  return (
    <Routes>
      <Route path="/admin" element={<AdminPageLayout />}  >
        <Route index element={<Dashboard />} />
        {adminRoutes.map((route, index) => (
          checkStaffRoles(user, route.roles, route.path) && <Route key={index} path={route.path} element={React.createElement(require(`./components/${route.component}`).default)} />
        ))}
        {user ? <Route path="*" element={<NoPage />} />
          : <Route path="*" element={<Login />} />}
      </Route>
      <Route path="/" element={<PublicPageLayout />}  >
        <Route index element={<Dashboard />} />
        {publicRoutes.map((route, index) => (
          checkGuest(user, route.roles, route.path) && <Route key={index} path={route.path} element={React.createElement(require(`./components/${route.component}`).default)} />
        ))}
        {user ? <Route path="*" element={<NoPage />} />
          : <Route path="*" element={<Login />} />}
      </Route>
    </Routes>
  );
}

export default App;
