import { render, screen, RenderResult } from "../../../test-utils/testing-library-utils";
import { server } from "../../../mocks/server";
import { DefaultRequestBody, HttpRequest, HttpResponse, rest } from "msw";

import OrderConfirmation from "../OrderConfirmation";
import React from "react";

test("error response from server for submitting order", async () => {
  // override default msw response for options endpoint with error response
  server.resetHandlers(
    rest.post<DefaultRequestBody, HttpRequest<DefaultRequestBody>, HttpResponse<void>>(
      "http://localhost:3030/order",
      (_, res, ctx) => {
        return res(ctx.status(500));
      }
    )
  );

  const { rerender }: RenderResult = render(<OrderConfirmation setOrderPhase={jest.fn()} />);

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(
    "An unexpected error occurred. Please try again later."
  );
});

function expect(alert: HTMLElement) {
  throw new Error("Function not implemented.");
}
