import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantityEdit from "./QuantityEdit";

describe("QuantityEdit", () => {
  test("calls onChange with the incremented value", async () => {
    const onChange = vi.fn();

    render(<QuantityEdit value={2} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "+1" }));

    expect(onChange).toHaveBeenCalledWith(3);
  });

  test("does not call onChange when increment would exceed max", async () => {
    const onChange = vi.fn();

    render(<QuantityEdit value={2} max={2} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "+1" }));

    expect(onChange).not.toHaveBeenCalled();
  });

  test("calls onChange with the decremented value", async () => {
    const onChange = vi.fn();

    render(<QuantityEdit value={2} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "-1" }));

    expect(onChange).toHaveBeenCalledWith(1);
  });
});
