import React from "react";
import { useTranslation } from "contexts/TranslationContext";
import { Link } from "react-router-dom";
import config from "models/config";

const NoPage = (props) => {
  const { __ } = useTranslation();
  const redir = props.redir ?? '/'

  return (
    <>
      <div id="layoutError">
        <div id="layoutError_content">
          <main>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <div className="text-center mt-4">
                    <img className="mb-4 img-error" src="/assets/img/error-404-monochrome.svg" alt="404" />
                    <p className="lead">{__('This requested URL was not found on this server.')}</p>
                    <Link to={redir}>
                      <i className="fas fa-arrow-left me-1"></i>
                      {__('Return to Main Page')}</Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div id="layoutError_footer">
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">Copyright &copy; {config.appName} 2023-2024</div>
                <div>
                  {/* <a href="#">Privacy Policy</a>
                                &middot;
                                <a href="#">Terms &amp; Conditions</a> */}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default NoPage;
