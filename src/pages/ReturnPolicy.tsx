import PolicyLayout from "@/components/PolicyLayout";
import { getOverride } from "@/lib/overrides";
import { useState, useEffect } from "react";

const defaultData = {
  mainTitle: "Return Policy",
  lastUpdated: "March 6, 2026",
  sections: [
    {
      title: "30-Day Free Returns",
      content: "We want you to love your furniture. If you are not completely satisfied, you may return most items within 30 days of delivery for a full refund or exchange. The item must be in its original condition, unused, and in the original packaging where possible."
    },
    {
      title: "How to Return",
      content: "To initiate a return, contact us at hello@nord-furniture.com with your order number and reason for return. We will provide a return authorization and instructions. You are responsible for return shipping costs unless the item arrived damaged or defective. We recommend using a tracked shipping service."
    },
    {
      title: "Exclusions",
      content: "Custom-made, personalized, or made-to-order items cannot be returned unless they are defective. Sale items may have different return terms—please check the product page at the time of purchase. Items that show signs of use, assembly, or damage may not be eligible for a full refund."
    },
    {
      title: "Refunds",
      content: "Once we receive and inspect your return, we will process your refund within 5–7 business days. Refunds will be credited to your original payment method. Please note that your bank or card issuer may take additional time to post the refund to your account."
    },
    {
      title: "Exchanges",
      content: "Need a different size, color, or style? We are happy to arrange an exchange. Contact us within 30 days of delivery, and we will guide you through the process. Exchanges are subject to product availability."
    }
  ]
};

const ReturnPolicy = () => {
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    const stored = getOverride("policies.return.data", "");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse return policy data", e);
      }
    }
  }, []);

  return (
    <PolicyLayout title={data.mainTitle} lastUpdated={data.lastUpdated}>
      {data.sections.map((section, idx) => (
        <section key={idx}>
          <h2 className="font-display text-xl font-semibold text-foreground mb-3">{section.title}</h2>
          <p className="whitespace-pre-wrap">{section.content}</p>
        </section>
      ))}
    </PolicyLayout>
  );
};

export default ReturnPolicy;
