import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders GlowCart header", () => {
  render(<App />);
  const heading = screen.getByText(/GlowCart/i);
  expect(heading).toBeInTheDocument();
});
