import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfigProvider } from "contexts/ConfigContext";
import { MessagesProvider, useMessages } from "contexts/MessagesContext";
import { TranslationProvider } from "contexts/TranslationContext";
import MessageArea from "./MessageArea";

const MessageButton = () => {
  const { addMessage } = useMessages();

  return (
    <button type="button" onClick={() => addMessage("success", "Saved :item", { item: "order" })}>
      Add message
    </button>
  );
};

const renderWithProviders = (ui) => {
  window.history.pushState({}, "", "/");

  return render(
    <ConfigProvider>
      <TranslationProvider>
        <MessagesProvider>{ui}</MessagesProvider>
      </TranslationProvider>
    </ConfigProvider>
  );
};

describe("MessageArea", () => {
  test("renders translated message arguments and dismisses the alert", async () => {
    renderWithProviders(
      <>
        <MessageButton />
        <MessageArea />
      </>
    );

    await act(async () => {
      userEvent.click(screen.getByRole("button", { name: "Add message" }));
    });

    expect(screen.getByText("Saved order")).toBeInTheDocument();

    await act(async () => {
      userEvent.click(screen.getByRole("button", { name: /close/i }));
    });

    expect(screen.queryByText("Saved order")).not.toBeInTheDocument();
  });
});
