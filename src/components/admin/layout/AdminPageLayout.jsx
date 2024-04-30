import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import TopNav from "./TopNav";
import SideNav from "./SideNav";
import ContentArea from "components/common/ContentArea";
import { useConfig } from "contexts/ConfigContext";
import { useTranslation } from "contexts/TranslationContext";
import config from "models/config";


const AdminPageLayout = () => {
  // az alábbi két sor fontos, ne töröld ki, köszi! <3
  const { applyStaffRealm, realm_path } = useConfig();
  const { __ } = useTranslation();

  useEffect(() => {
    applyStaffRealm();
  });

  return (
    <>
      <link rel="stylesheet" type="text/css" href="/assets/css/adm.css" />
      <TopNav />
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <SideNav />
        </div>
        <div id="layoutSidenav_content">
          <ContentArea />
          <footer>
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div>Copyright &copy; {config.appName} {new Date().getFullYear()}</div>
                <div>
                  <Link to={realm_path + "/privacy"}>{__('Privacy Policy')}</Link>
                  &middot;
                  <Link to={realm_path + "/terms"}>{__('Terms &amp; Conditions')}</Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default AdminPageLayout;
