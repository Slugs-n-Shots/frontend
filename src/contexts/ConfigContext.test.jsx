import { render, screen } from "@testing-library/react";
import { ConfigProvider, useConfig } from "./ConfigContext";
import { UserProvider, useUser } from "./UserContext";

const ConfigProbe = () => {
  const { realm, realm_path, getConfig } = useConfig();

  return (
    <dl>
      <dt>realm</dt>
      <dd>{realm}</dd>
      <dt>path</dt>
      <dd>{realm_path ?? ""}</dd>
      <dt>server</dt>
      <dd>{getConfig("serverURL")}</dd>
    </dl>
  );
};

const UserProbe = () => {
  const { user, userIsLoggedIn } = useUser();

  return (
    <div>
      <span>{user?.email ?? "no-user"}</span>
      <span>{userIsLoggedIn() ? "logged-in" : "logged-out"}</span>
    </div>
  );
};

describe("ConfigProvider", () => {
  test("starts in guest realm outside admin routes", () => {
    window.history.pushState({}, "", "/");

    render(
      <ConfigProvider>
        <ConfigProbe />
      </ConfigProvider>
    );

    expect(screen.getByText("guest")).toBeInTheDocument();
    expect(screen.getByText("http://slugs-n-shots.test/api/guest/")).toBeInTheDocument();
  });

  test("starts in staff realm on admin routes", () => {
    window.history.pushState({}, "", "/admin");

    render(
      <ConfigProvider>
        <ConfigProbe />
      </ConfigProvider>
    );

    expect(screen.getByText("staff")).toBeInTheDocument();
    expect(screen.getByText("/admin")).toBeInTheDocument();
    expect(screen.getByText("http://slugs-n-shots.test/api/staff/")).toBeInTheDocument();
  });

  test("restores guest user from localStorage after reload", () => {
    window.history.pushState({}, "", "/profile");
    localStorage.setItem("config", JSON.stringify({
      token: "guest-token",
      user: { id: 1, email: "guest@example.com" },
    }));

    render(
      <ConfigProvider>
        <UserProvider>
          <UserProbe />
        </UserProvider>
      </ConfigProvider>
    );

    expect(screen.getByText("guest@example.com")).toBeInTheDocument();
    expect(screen.getByText("logged-in")).toBeInTheDocument();
  });

});
