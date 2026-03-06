import PolicyLayout from "@/components/PolicyLayout";

const PrivacyPolicy = () => {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="March 6, 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Introduction</h2>
        <p>
          NØRD Furniture ("we," "our," or "us") is committed to protecting your privacy. This 
          Privacy Policy explains how we collect, use, disclose, and safeguard your information 
          when you visit our website or make a purchase. Please read this policy carefully.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Information We Collect</h2>
        <p>
          We collect information you provide directly, such as your name, email address, shipping 
          address, phone number, and payment details when you place an order or create an account. 
          We also automatically collect certain information when you visit our site, including 
          your IP address, browser type, and pages you view. This helps us improve our website 
          and your shopping experience.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">How We Use Your Information</h2>
        <p>
          We use your information to process orders, send order confirmations and shipping updates, 
          respond to your inquiries, and improve our products and services. With your consent, we 
          may send you promotional emails about new products, offers, and design inspiration. You 
          can unsubscribe at any time from the link in our emails.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Information Sharing</h2>
        <p>
          We do not sell your personal information. We may share your information with trusted 
          service providers who assist us with order fulfillment, payment processing, and 
          shipping. These partners are required to protect your information and use it only for 
          the purposes we specify. We may also disclose information when required by law.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your data 
          against unauthorized access, alteration, or destruction. Payment information is 
          processed securely through our payment providers and is not stored on our servers.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Your Rights</h2>
        <p>
          Depending on your location, you may have the right to access, correct, or delete your 
          personal data. You may also request a copy of your data or object to certain processing. 
          To exercise these rights, contact us at hello@nord-furniture.com.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or our practices, please contact us at 
          hello@nord-furniture.com or visit our Contact page.
        </p>
      </section>
    </PolicyLayout>
  );
};

export default PrivacyPolicy;
