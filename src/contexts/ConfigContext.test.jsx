import { render, screen } from "@testing-library/react";
import { ConfigProvider, useConfig } from "./ConfigContext";

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
});
