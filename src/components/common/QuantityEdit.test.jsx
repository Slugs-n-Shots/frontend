import { fireEvent, render, screen } from "@testing-library/react";
import QuantityEdit from "./QuantityEdit";

describe("QuantityEdit", () => {
  test("calls onChange with the incremented value", () => {
    const onChange = vi.fn();

    render(<QuantityEdit value={2} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "+1" }));

    expect(onChange).toHaveBeenCalledWith(3);
  }, 10000);

  test("does not call onChange when increment would exceed max", () => {
    const onChange = vi.fn();

    render(<QuantityEdit value={2} max={2} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "+1" }));

    expect(onChange).not.toHaveBeenCalled();
  }, 10000);

  test("calls onChange with the decremented value", () => {
    const onChange = vi.fn();

    render(<QuantityEdit value={2} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "-1" }));

    expect(onChange).toHaveBeenCalledWith(1);
  }, 10000);
});
