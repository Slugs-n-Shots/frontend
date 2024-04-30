import React, { useEffect } from "react";
import TopNav from "components/public/layout/TopNav";
import ContentArea from "components/common/ContentArea";
import { useConfig } from "contexts/ConfigContext";
import { CartProvider } from "contexts/CartContext";

const PublicPageLayout = () => {
  const { applyGuestRealm } = useConfig();

  useEffect(() => {
    applyGuestRealm()

    // const link = document.createElement('link');
    // link.href = '/assets/css/bootstrap.min.css';
    // link.type = 'text/css';
    // link.rel = 'stylesheet';

    // document.head.appendChild(link);

    return () => {
      // document.head.removeChild(link);
    };
  });


  return (
    <>
      <link rel="stylesheet" type="text/css" href="/assets/css/pub.css" />
      <CartProvider>
        <TopNav />
        <ContentArea />
      </CartProvider>
    </>
  );
};

export default PublicPageLayout;
