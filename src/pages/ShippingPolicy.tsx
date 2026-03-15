import PolicyLayout from "@/components/PolicyLayout";
import { getOverride } from "@/lib/overrides";
import { useState, useEffect } from "react";

const defaultData = {
  mainTitle: "Shipping Policy",
  lastUpdated: "March 6, 2026",
  sections: [
    {
      title: "Delivery Options",
      content: "We offer several shipping options to suit your needs. Standard delivery takes 5–7 business days and is free on orders over $500. Express delivery (2–3 business days) is available for an additional $15. Store pickup is free—you can collect your order from our Stockholm showroom at your convenience."
    },
    {
      title: "Shipping Areas",
      content: "We ship throughout Sweden, Norway, Denmark, Finland, and to select European countries. International shipping is available—contact us for rates to your location. Due to the nature of our handcrafted furniture, some items may require white-glove delivery for an additional fee."
    },
    {
      title: "Processing Time",
      content: "Orders are processed within 2–3 business days. Custom or made-to-order pieces may require additional time—we will notify you of the expected delivery window at checkout. You will receive a tracking number once your order has shipped."
    },
    {
      title: "Carbon-Neutral Shipping",
      content: "All our shipments are carbon-neutral. We offset the emissions from every delivery through certified environmental projects, so you can enjoy your new furniture with a clear conscience."
    },
    {
      title: "Questions?",
      content: "If you have any questions about shipping, delivery, or tracking, please contact us at hello@nord-furniture.com or visit our Contact page."
    }
  ]
};

const ShippingPolicy = () => {
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    const stored = getOverride("policies.shipping.data", "");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse shipping policy data", e);
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

export default ShippingPolicy;
