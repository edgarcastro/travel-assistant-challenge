import { render } from "@testing-library/react";
import TravelItemSkeleton from "../components/TravelItemSkeleton";

describe("TravelItemSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<TravelItemSkeleton />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders the card container", () => {
    const { container } = render(<TravelItemSkeleton />);
    expect(container.querySelector(".rounded-xl")).toBeTruthy();
  });

  it("renders action button placeholders", () => {
    const { container } = render(<TravelItemSkeleton />);
    // Two action button skeletons at the end
    const squareSkeletons = container.querySelectorAll(".rounded-lg");
    expect(squareSkeletons.length).toBeGreaterThanOrEqual(2);
  });
});
