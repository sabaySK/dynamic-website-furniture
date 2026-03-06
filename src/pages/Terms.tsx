import PolicyLayout from "@/components/PolicyLayout";

const Terms = () => {
  return (
    <PolicyLayout title="Terms & Conditions" lastUpdated="March 6, 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Agreement to Terms</h2>
        <p>
          By accessing or using the NØRD Furniture website and services, you agree to be bound 
          by these Terms & Conditions. If you do not agree with any part of these terms, please 
          do not use our website or services.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Products and Orders</h2>
        <p>
          We strive to display our products accurately. However, colors, dimensions, and materials 
          may vary slightly from images due to screen settings and the natural nature of wood. 
          All prices are in USD and subject to change without notice. We reserve the right to 
          limit quantities and refuse orders that appear to be placed in bad faith.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Payment</h2>
        <p>
          Payment is due at the time of purchase. We accept major credit cards, ABA, Acleda, 
          Wing, and cash on delivery where available. By placing an order, you represent that 
          you are authorized to use the payment method provided. We may request additional 
          verification for your security.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Intellectual Property</h2>
        <p>
          All content on this website—including text, images, logos, and product designs—is the 
          property of NØRD Furniture or our licensors and is protected by copyright and trademark 
          laws. You may not reproduce, distribute, or use our content without prior written consent.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, NØRD Furniture shall not be liable for any 
          indirect, incidental, special, or consequential damages arising from your use of our 
          website or products. Our total liability shall not exceed the amount you paid for the 
          products in question.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Governing Law</h2>
        <p>
          These Terms & Conditions are governed by the laws of Sweden. Any disputes arising from 
          these terms or your use of our services shall be resolved in the courts of Stockholm, 
          Sweden.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Changes</h2>
        <p>
          We may update these Terms & Conditions from time to time. We will notify you of any 
          material changes by posting the updated terms on this page and updating the "Last 
          updated" date. Your continued use of our website after such changes constitutes 
          acceptance of the updated terms.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Contact</h2>
        <p>
          For questions about these Terms & Conditions, please contact us at hello@nord-furniture.com 
          or visit our Contact page.
        </p>
      </section>
    </PolicyLayout>
  );
};

export default Terms;
