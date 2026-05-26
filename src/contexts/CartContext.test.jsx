import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";

const { addMessage, get, getConfig, initialCart, post, setConfig } = vi.hoisted(() => ({
  addMessage: vi.fn(),
  get: vi.fn(),
  getConfig: vi.fn(),
  initialCart: { value: {} },
  post: vi.fn(),
  setConfig: vi.fn(),
}));

vi.mock("./ApiContext", () => ({
  useApi: () => ({ get, post }),
}));

vi.mock("./ConfigContext", () => ({
  useConfig: () => ({
    getConfig,
    realm: "guest",
    setConfig,
  }),
}));

vi.mock("./MessagesContext", () => ({
  useMessages: () => ({ addMessage }),
}));

vi.mock("./TranslationContext", () => ({
  useTranslation: () => ({ language: "en" }),
}));

const CartHarness = () => {
  const { cartItems, makeOrder } = useCart();

  return (
    <>
      <pre data-testid="cart-state">{JSON.stringify(cartItems)}</pre>
      <button type="button" onClick={makeOrder}>Make order</button>
    </>
  );
};

const renderCart = async () => {
  render(
    <CartProvider>
      <CartHarness />
    </CartProvider>
  );

  await waitFor(() => {
    expect(screen.getByTestId("cart-state")).toHaveTextContent("5|1|glass");
  });
};

describe("CartContext", () => {
  beforeEach(() => {
    addMessage.mockReset();
    get.mockReset();
    getConfig.mockReset();
    post.mockReset();
    setConfig.mockReset();

    initialCart.value = {
      "5|1|glass": 2,
      "8|0.5|": 1,
    };

    get.mockResolvedValue({ data: {} });
    getConfig.mockImplementation((key, defaultValue = null) => {
      if (key === "cart") {
        return initialCart.value;
      }

      return defaultValue;
    });
  });

  test("sends the existing order payload and clears the cart only after success", async () => {
    post.mockResolvedValue({ data: { message: "ok" } });
    await renderCart();

    fireEvent.click(screen.getByRole("button", { name: "Make order" }));

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith("orders", {
        cart: [
          { drink_id: 5, quantity: 1, unit: "glass", ordered_quantity: 2 },
          { drink_id: 8, quantity: 0.5, unit: null, ordered_quantity: 1 },
        ],
      });
    });

    expect(setConfig).toHaveBeenCalledWith("cart", null);
    expect(addMessage).toHaveBeenCalledWith("success", "Thanks for your order! Our bartenders are on it.");
    expect(screen.getByTestId("cart-state")).toHaveTextContent("{}");
  });

  test("keeps the cart and shows the backend message when per-guest spending limit recommends pay now", async () => {
    post.mockRejectedValue({
      response: {
        status: 409,
        data: {
          message: "The per-guest spending limit would be exceeded. Please continue with immediate payment or pay pending items before ordering more.",
          code: "per_guest_spending_limit_exceeded",
          recommended_action: "pay_now",
          limit: 1000,
          pending_total: 800,
          new_order_total: 300,
        },
      },
    });
    await renderCart();

    fireEvent.click(screen.getByRole("button", { name: "Make order" }));

    await waitFor(() => {
      expect(addMessage).toHaveBeenCalledWith(
        "warning",
        "The per-guest spending limit would be exceeded. Please continue with immediate payment or pay pending items before ordering more."
      );
    });

    expect(setConfig).not.toHaveBeenCalledWith("cart", null);
    expect(screen.getByTestId("cart-state")).toHaveTextContent("5|1|glass");
  });
});
