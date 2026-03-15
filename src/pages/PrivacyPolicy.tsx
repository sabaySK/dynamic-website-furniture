import PolicyLayout from "@/components/PolicyLayout";
import { getOverride } from "@/lib/overrides";
import { useState, useEffect } from "react";

const defaultData = {
  mainTitle: "Privacy Policy",
  lastUpdated: "March 6, 2026",
  sections: [
    {
      title: "Introduction",
      content: "NØRD Furniture (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. Please read this policy carefully."
    },
    {
      title: "Information We Collect",
      content: "We collect information you provide directly, such as your name, email address, shipping address, phone number, and payment details when you place an order or create an account. We also automatically collect certain information when you visit our site, including your IP address, browser type, and pages you view. This helps us improve our website and your shopping experience."
    },
    {
      title: "How We Use Your Information",
      content: "We use your information to process orders, send order confirmations and shipping updates, respond to your inquiries, and improve our products and services. With your consent, we may send you promotional emails about new products, offers, and design inspiration. You can unsubscribe at any time from the link in our emails."
    },
    {
      title: "Information Sharing",
      content: "We do not sell your personal information. We may share your information with trusted service providers who assist us with order fulfillment, payment processing, and shipping. These partners are required to protect your information and use it only for the purposes we specify. We may also disclose information when required by law."
    },
    {
      title: "Data Security",
      content: "We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, or destruction. Payment information is processed securely through our payment providers and is not stored on our servers."
    },
    {
      title: "Your Rights",
      content: "Depending on your location, you may have the right to access, correct, or delete your personal data. You may also request a copy of your data or object to certain processing. To exercise these rights, contact us at hello@nord-furniture.com."
    },
    {
      title: "Contact Us",
      content: "If you have questions about this Privacy Policy or our practices, please contact us at hello@nord-furniture.com or visit our Contact page."
    }
  ]
};

const PrivacyPolicy = () => {
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    const stored = getOverride("policies.privacy.data", "");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse privacy policy data", e);
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

export default PrivacyPolicy;
