import { render as rtlRender, RenderOptions } from "@testing-library/react";
import { OrderDetailsProvider } from "../contexts/OrderDetails";
import { ReactElement } from "react";

const renderWithContext = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) =>
  rtlRender(ui, {
    wrapper: OrderDetailsProvider,
    ...options,
  });

// re-export everything from @testing-library/react
export * from "@testing-library/react";

// override render method
export { renderWithContext as render };