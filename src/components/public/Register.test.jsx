import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register";

const { addMessage, navigate, post } = vi.hoisted(() => ({
  addMessage: vi.fn(),
  navigate: vi.fn(),
  post: vi.fn(),
}));

vi.mock("contexts/ApiContext", () => ({
  useApi: () => ({ post }),
}));

vi.mock("contexts/MessagesContext", () => ({
  useMessages: () => ({ addMessage }),
}));

vi.mock("contexts/TranslationContext", () => ({
  useTranslation: () => ({ __: (text) => text }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

const renderRegister = () => {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
};

describe("Register", () => {
  beforeEach(() => {
    addMessage.mockReset();
    navigate.mockReset();
    post.mockReset();
    post.mockResolvedValue({ data: { message: "Registration created" } });
  });

  test("requires 18+ acceptance and sends it in the registration payload", async () => {
    renderRegister();

    const submitButton = screen.getByRole("button", { name: "Create Account" });

    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Alice" } });
    fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Example" } });
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "alice@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Password1!" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "Password1!" } });

    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByRole("checkbox", { name: /18/i }));
    expect(submitButton).toBeEnabled();

    fireEvent.click(submitButton);

    expect(post).toHaveBeenCalledWith("register", {
      first_name: "Alice",
      last_name: "Example",
      email: "alice@example.com",
      password: "Password1!",
      is_over_18: true,
    });
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/login");
    });
  }, 10000);
});
