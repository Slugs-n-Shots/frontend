import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "./Profile";

const { addMessage, deleteX, get, post, realm, user } = vi.hoisted(() => ({
  addMessage: vi.fn(),
  deleteX: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  realm: { value: "guest" },
  user: { value: null },
}));

const { logout, navigate } = vi.hoisted(() => ({
  logout: vi.fn(),
  navigate: vi.fn(),
}));

const { createObjectURL, revokeObjectURL } = vi.hoisted(() => ({
  createObjectURL: vi.fn(),
  revokeObjectURL: vi.fn(),
}));

Object.defineProperty(globalThis.URL, "createObjectURL", {
  configurable: true,
  value: createObjectURL,
});
Object.defineProperty(globalThis.URL, "revokeObjectURL", {
  configurable: true,
  value: revokeObjectURL,
});

vi.mock("contexts/UserContext", () => ({
  useUser: () => ({ logout, user: user.value }),
}));

vi.mock("contexts/MessagesContext", () => ({
  useMessages: () => ({ addMessage }),
}));

vi.mock("contexts/ApiContext", () => ({
  useApi: () => ({ get, post, deleteX }),
}));

vi.mock("contexts/TranslationContext", () => ({
  useTranslation: () => ({ __: (text) => text }),
}));

vi.mock("contexts/ConfigContext", () => ({
  useConfig: () => ({
    getConfig: (key) => key === "serverURL" ? "http://slugs-n-shots.test/api/guest/" : null,
    realm: realm.value,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe("Profile", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    addMessage.mockReset();
    deleteX.mockReset();
    get.mockReset();
    logout.mockReset();
    navigate.mockReset();
    post.mockReset();
    createObjectURL.mockReset();
    revokeObjectURL.mockReset();
    createObjectURL.mockReturnValue("blob:guest-data-export");
    realm.value = "guest";
    user.value = null;
  });

  test("loads guest profile data and shows guest compliance fields", async () => {
    get.mockResolvedValue({
      data: {
        id: 1,
        name: "Jane Doe",
        first_name: "Jane",
        middle_name: null,
        last_name: "Doe",
        email: "jane@example.com",
        address: "1117 Budapest, Teszt utca 1.",
        phone: "+36 30 123 4567",
        birth_date: "2000-01-02",
        is_over_18: true,
        age_verified_at: "2026-05-15T18:30:00Z",
        anonymized_at: null,
        picture: "profile.jpg",
      },
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText("Please wait")).toBeInTheDocument();

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith("me");

    expect(screen.getByText("1117 Budapest, Teszt utca 1.")).toBeInTheDocument();
    expect(screen.getByText("Compliance")).toBeInTheDocument();
    expect(screen.getByText("18+ confirmed:")).toBeInTheDocument();
    expect(screen.getByText("Uploaded")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Profile picture" })).toHaveAttribute(
      "src",
      "http://slugs-n-shots.test/storage/profile.jpg"
    );
  }, 10000);

  test("does not show guest compliance fields for staff profile", async () => {
    realm.value = "staff";
    get.mockResolvedValue({
      data: [{
        id: 1,
        name: "Slugs Admin Shots",
        first_name: "Slugs",
        middle_name: "Admin",
        last_name: "Shots",
        email: "staff@example.com",
        role: "admin",
      }],
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(await screen.findByText("Slugs Admin Shots")).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith("me");

    expect(screen.queryByText("Compliance")).not.toBeInTheDocument();
    expect(screen.queryByText("18+ confirmed:")).not.toBeInTheDocument();
  });

  test.skip("uploads guest profile picture with the picture form data field", async () => {
    get.mockResolvedValue({
      data: {
        id: 1,
        name: "Jane Doe",
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@example.com",
        is_over_18: true,
        picture: null,
      },
    });
    post.mockResolvedValue({
      data: {
        id: 1,
        name: "Jane Doe",
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@example.com",
        is_over_18: true,
        picture: "profile.jpg",
      },
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();

    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Choose profile picture"), {
      target: { files: [file] },
    });
    fireEvent.click(screen.getByRole("button", { name: "Upload picture" }));

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith("me/picture", expect.any(FormData));
      expect(addMessage).toHaveBeenCalledWith("success", "Profile picture uploaded");
    });

    const formData = post.mock.calls[0][1];
    expect(formData.get("picture")).toBe(file);
  });

  test.skip("downloads guest personal data as a JSON blob", async () => {
    const exportPayload = {
      exported_at: "2026-05-25T10:00:00Z",
      guest: {
        id: 1,
        email: "jane@example.com",
      },
      orders: [],
      receipts: [],
      payment_attempts: [],
      recent_drinks: [],
      gdpr_audit_events: [],
    };

    get.mockImplementation((endpoint) => {
      if (endpoint === "me/export") {
        return Promise.resolve({ data: exportPayload });
      }

      return Promise.resolve({
        data: {
          id: 1,
          name: "Jane Doe",
          first_name: "Jane",
          last_name: "Doe",
          email: "jane@example.com",
          is_over_18: true,
          picture: null,
        },
      });
    });

    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Download my data" }));

    await waitFor(() => {
      expect(get).toHaveBeenCalledWith("me/export");
      expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
      expect(click).toHaveBeenCalled();
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:guest-data-export");
    });

    click.mockRestore();
  });

  test.skip("shows anonymization blocking reasons from the check endpoint", async () => {
    get.mockImplementation((endpoint) => {
      if (endpoint === "me/anonymize/check") {
        return Promise.resolve({
          data: {
            can_anonymize: false,
            blocking_reasons: [
              {
                code: "pending_payment",
                message: "You have order items waiting for payment.",
              },
            ],
          },
        });
      }

      return Promise.resolve({
        data: {
          id: 1,
          name: "Jane Doe",
          first_name: "Jane",
          last_name: "Doe",
          email: "jane@example.com",
          is_over_18: true,
          picture: null,
        },
      });
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Check anonymization" }));

    expect(await screen.findByText("You have order items waiting for payment.")).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith("me/anonymize/check");
    expect(screen.getByRole("button", { name: "Anonymize my account" })).toBeDisabled();
  });

  test.skip("posts anonymization confirmation, logs out and navigates to public route", async () => {
    get.mockImplementation((endpoint) => {
      if (endpoint === "me/anonymize/check") {
        return Promise.resolve({
          data: {
            can_anonymize: true,
            blocking_reasons: [],
          },
        });
      }

      return Promise.resolve({
        data: {
          id: 1,
          name: "Jane Doe",
          first_name: "Jane",
          last_name: "Doe",
          email: "jane@example.com",
          is_over_18: true,
          picture: null,
        },
      });
    });
    post.mockResolvedValue({
      data: {
        message: "The account has been anonymized.",
      },
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Check anonymization" }));
    expect(await screen.findByText("Your account can be anonymized.")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("I understand this cannot be undone"));
    fireEvent.click(screen.getByRole("button", { name: "Anonymize my account" }));

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith("me/anonymize", { confirm: true });
      expect(logout).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith("/");
    });
  });

  test("logs out and redirects when profile load is unauthorized", async () => {
    const error = new Error("Unauthorized");
    error.response = { status: 401 };
    get.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith("/login");
    });
    expect(addMessage).not.toHaveBeenCalledWith("danger", expect.any(String));
  });
});
