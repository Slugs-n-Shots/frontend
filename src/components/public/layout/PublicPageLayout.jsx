import React, { useEffect } from "react";
import TopNav from "components/public/layout/TopNav";
import ContentArea from "components/common/ContentArea";
import { useConfig } from "contexts/ConfigContext";
import { CartProvider } from "contexts/CartContext";

const PublicPageLayout = () => {
  const { applyGuestRealm } = useConfig();

  useEffect(() => {
    applyGuestRealm()
  }, [applyGuestRealm]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = '/assets/css/pub.css';
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.dataset.layoutStyle = 'public';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
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
