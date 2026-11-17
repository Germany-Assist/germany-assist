import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PartnerMarquee from "../PartnerMarquee";

describe("PartnerMarquee", () => {
  it("renders the trusted-by label", () => {
    render(<PartnerMarquee />);
    expect(
      screen.getByText(/leading companies/i),
    ).toBeInTheDocument();
  });

  it("renders every partner name", () => {
    render(<PartnerMarquee />);
    for (const partner of ["Siemens", "SAP", "BMW", "Zalando", "Delivery Hero", "BioNTech"]) {
      expect(screen.getByText(partner)).toBeInTheDocument();
    }
  });
});
