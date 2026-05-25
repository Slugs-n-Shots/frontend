import { guestEndpoints, staffEndpoints } from "./index";

describe("api endpoint inventory", () => {
  test("keeps guest endpoints relative to the guest realm base URL", () => {
    expect(guestEndpoints.me).toBe("me");
    expect(guestEndpoints.login).toBe("login");
    expect(guestEndpoints.orders).toBe("orders");
    expect(guestEndpoints.drink(12)).toBe("drinks/12");
    expect(guestEndpoints.receipt(34)).toBe("receipts/34");
  });

  test("keeps staff endpoints relative to the staff realm base URL", () => {
    expect(staffEndpoints.me).toBe("me");
    expect(staffEndpoints.employees).toBe("employees");
    expect(staffEndpoints.orderAssign(7)).toBe("orders/assign/7");
    expect(staffEndpoints.orderDone(7)).toBe("orders/done/7");
    expect(staffEndpoints.orderUndoAssign(7)).toBe("orders/undo-assign/7");
  });
});
