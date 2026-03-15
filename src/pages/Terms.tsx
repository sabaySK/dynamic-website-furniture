import PolicyLayout from "@/components/PolicyLayout";
import { getOverride } from "@/lib/overrides";
import { useState, useEffect } from "react";

const defaultData = {
  mainTitle: "Terms & Conditions",
  lastUpdated: "March 6, 2026",
  sections: [
    {
      title: "Agreement to Terms",
      content: "By accessing or using the NØRD Furniture website and services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website or services."
    },
    {
      title: "Products and Orders",
      content: "We strive to display our products accurately. However, colors, dimensions, and materials may vary slightly from images due to screen settings and the natural nature of wood. All prices are in USD and subject to change without notice. We reserve the right to limit quantities and refuse orders that appear to be placed in bad faith."
    },
    {
      title: "Payment",
      content: "Payment is due at the time of purchase. We accept major credit cards, ABA, Acleda, Wing, and cash on delivery where available. By placing an order, you represent that you are authorized to use the payment method provided. We may request additional verification for your security."
    },
    {
      title: "Intellectual Property",
      content: "All content on this website—including text, images, logos, and product designs—is the property of NØRD Furniture or our licensors and is protected by copyright and trademark laws. You may not reproduce, distribute, or use our content without prior written consent."
    },
    {
      title: "Limitation of Liability",
      content: "To the fullest extent permitted by law, NØRD Furniture shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount you paid for the products in question."
    },
    {
      title: "Governing Law",
      content: "These Terms & Conditions are governed by the laws of Sweden. Any disputes arising from these terms or your use of our services shall be resolved in the courts of Stockholm, Sweden."
    },
    {
      title: "Changes",
      content: "We may update these Terms & Conditions from time to time. We will notify you of any material changes by posting the updated terms on this page and updating the \"Last updated\" date. Your continued use of our website after such changes constitutes acceptance of the updated terms."
    },
    {
      title: "Contact",
      content: "For questions about these Terms & Conditions, please contact us at hello@nord-furniture.com or visit our Contact page."
    }
  ]
};

const Terms = () => {
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    const stored = getOverride("policies.terms.data", "");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse terms data", e);
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

export default Terms;
