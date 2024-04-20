import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import TopNav from "./TopNav";
import SideNav from "./SideNav";
import ContentArea from "components/common/ContentArea";
import { useConfig } from "contexts/ConfigContext";
import { useTranslation } from "contexts/TranslationContext";

const AdminPageLayout = () => {
  // az alábbi két sor fontos, ne töröld ki, köszi! <3
  const { applyStaffRealm } = useConfig();
  const { __ } = useTranslation();

  useEffect(() => {
    applyStaffRealm();

    const link = document.createElement('link');
    link.href = '/assets/css/sbAdmin.css';
    link.type = 'text/css';
    link.rel = 'stylesheet';

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  });

  return (
    <>
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
                <div>Copyright &copy; Slugs'n'Shots {new Date().getFullYear()}</div>
                <div>
                  <Link to="/privacy">{__('Privacy Policy')}</Link>
                  &middot;
                  <Link to="/terms">{__('Terms &amp; Conditions')}</Link>
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
