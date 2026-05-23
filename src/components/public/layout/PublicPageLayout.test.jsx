import { render } from "@testing-library/react";
import PublicPageLayout from "./PublicPageLayout";

const applyGuestRealm = vi.fn();

vi.mock("contexts/ConfigContext", () => ({
  useConfig: () => ({ applyGuestRealm }),
}));

vi.mock("contexts/CartContext", () => ({
  CartProvider: ({ children }) => <>{children}</>,
}));

vi.mock("components/public/layout/TopNav", () => ({
  default: () => <nav data-testid="public-top-nav" />,
}));

vi.mock("components/common/ContentArea", () => ({
  default: () => <main data-testid="content-area" />,
}));

describe("PublicPageLayout", () => {
  test("uses npm Bootstrap CSS instead of the static public stylesheet", () => {
    const { unmount } = render(<PublicPageLayout />);

    const publicStyles = document.head.querySelectorAll('link[data-layout-style="public"]');
    const bootstrapStyle = document.head.querySelector('link[data-style-source="bootstrap-package"]');
    const overrideStyle = document.head.querySelector('link[data-style-source="public-overrides"]');

    expect(applyGuestRealm).toHaveBeenCalled();
    expect(publicStyles).toHaveLength(2);
    expect(bootstrapStyle).toBeInTheDocument();
    expect(overrideStyle).toBeInTheDocument();
    expect(bootstrapStyle).toHaveAttribute("rel", "stylesheet");
    expect(overrideStyle).toHaveAttribute("rel", "stylesheet");
    expect(bootstrapStyle.href).not.toContain("/assets/css/pub.css");
    expect(overrideStyle.href).not.toContain("/assets/css/pub.css");

    unmount();

    expect(document.head.querySelector('link[data-layout-style="public"]')).not.toBeInTheDocument();
  });
});
