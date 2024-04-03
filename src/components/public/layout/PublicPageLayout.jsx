import React, { useEffect } from "react";
import TopNav from "components/public/layout/TopNav";
import ContentArea from "components/common/ContentArea";
import { useConfig } from "contexts/ConfigContext";
import { CartProvider } from "contexts/CartContext";

const PublicPageLayout = () => {
  const { applyGuestRealm } = useConfig();

  useEffect(() => {
    applyGuestRealm()
    import('bootstrap/dist/css/bootstrap.min.css');
  });

  return (
    <CartProvider>
      <TopNav />
      <ContentArea />
    </CartProvider>
  );
};

export default PublicPageLayout;
