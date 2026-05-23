import React, { useEffect } from "react";
import TopNav from "components/public/layout/TopNav";
import ContentArea from "components/common/ContentArea";
import { useConfig } from "contexts/ConfigContext";
import { CartProvider } from "contexts/CartContext";
import bootstrapCssUrl from "bootstrap/dist/css/bootstrap.min.css?url";
import publicLayoutCssUrl from "./publicLayout.css?url";

const PublicPageLayout = () => {
  const { applyGuestRealm } = useConfig();

  useEffect(() => {
    applyGuestRealm()
  }, [applyGuestRealm]);

  useEffect(() => {
    const stylesheets = [
      { href: bootstrapCssUrl, source: 'bootstrap-package' },
      { href: publicLayoutCssUrl, source: 'public-overrides' },
    ].map(({ href, source }) => {
      const link = document.createElement('link');
      link.href = href;
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.dataset.layoutStyle = 'public';
      link.dataset.styleSource = source;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      stylesheets.forEach((link) => {
        document.head.removeChild(link);
      });
    };
  }, []);


  return (
    <>
      <CartProvider>
        <TopNav />
        <ContentArea />
      </CartProvider>
    </>
  );
};

export default PublicPageLayout;
