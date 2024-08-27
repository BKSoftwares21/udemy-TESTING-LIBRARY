import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

test("Order phases for happy path", async () => {
  const user = await userEvent.setup();
  // render app
  // Don't need to wrap in provider; already wrapped!
  const { unmount } = render(<App />);

  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole<HTMLInputElement>("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");

  const chocolateInput = screen.getByRole<HTMLInputElement>("spinbutton", {
    name: "Chocolate",
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");

  const cherriesCheckbox = await screen.findByRole<HTMLInputElement>(
    "checkbox",
    {
      name: "Cherries",
    }
  );
  await user.click(cherriesCheckbox);

  // find and click order summary button
  const orderSummaryButton = screen.getByRole<HTMLButtonElement>("button", {
    name: /order sundae/i,
  });
  await user.click(orderSummaryButton);

  // check summary subtotals
  const summaryHeading = screen.getByRole<HTMLHeadingElement>("heading", {
    name: "Order Summary",
  });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = screen.getByRole<HTMLHeadingElement>("heading", {
    name: "Scoops: $6.00",
  });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole<HTMLHeadingElement>("heading", {
    name: "Toppings: $1.50",
  });
  expect(toppingsHeading).toBeInTheDocument();

  // check summary option Detailss
  expect(screen.getByText("1 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("2 Chocolate")).toBeInTheDocument();
  expect(screen.getByText("Cherries")).toBeInTheDocument();

  // accept terms and click button
  const tcCheckbox = screen.getByRole<HTMLInputElement>("checkbox", {
    name: /terms and conditions/i,
  });
  await user.click(tcCheckbox);

  const confirmOrderButton = screen.getByRole<HTMLButtonElement>("button", {
    name: /confirm order/i,
  });
  await user.click(confirmOrderButton);

  // Expect "loading" to show
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  // check confirmation page text
  // this one is async because there is a POST request to server in between summary
  //    and confirmation pages
  const thankYouHeader = await screen.findByRole<HTMLHeadingElement>(
    "heading",
    {
      name: /thank you/i,
    }
  );
  expect(thankYouHeader).toBeInTheDocument();

  // expect that loading has disappeared
  const notLoading = screen.queryByText("loading");
  expect(notLoading).not.toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // find and click "new order" button on confirmation page
  const newOrderButton = screen.getByRole<HTMLButtonElement>("button", {
    name: /new order/i,
  });
  await user.click(newOrderButton);

  // check that scoops and toppings have been reset
  const scoopsTotal = await screen.findByText("Scoops total: $0.00");
  expect(scoopsTotal).toBeInTheDocument();
  const toppingsTotal = screen.getByText("Toppings total: $0.00");
  expect(toppingsTotal).toBeInTheDocument();

  // explicitly unmount component to trigger network call cancellation on cleanup
  unmount();
});

test("Toppings header is not on summary page if no toppings ordered", async () => {
  const user = await userEvent.setup();
  // render app
  render(<App />);

  // add ice cream scoops but no toppings
  const vanillaInput = await screen.findByRole<HTMLInputElement>("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");

  const chocolateInput = screen.getByRole<HTMLInputElement>("spinbutton", {
    name: "Chocolate",
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");

  // find and click order summary button
  const orderSummaryButton = screen.getByRole<HTMLButtonElement>("button", {
    name: /order sundae/i,
  });
  await user.click(orderSummaryButton);

  const scoopsHeading = screen.getByRole<HTMLHeadingElement>("heading", {
    name: "Scoops: $6.00",
  });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.queryByRole<HTMLHeadingElement>("heading", {
    name: /toppings/i,
  });
  expect(toppingsHeading).not.toBeInTheDocument();
});

function expect(summaryHeading: HTMLHeadingElement) {
  throw new Error("Function not implemented.");
}
