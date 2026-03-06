import PolicyLayout from "@/components/PolicyLayout";

const ShippingPolicy = () => {
  return (
    <PolicyLayout title="Shipping Policy" lastUpdated="March 6, 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Delivery Options</h2>
        <p>
          We offer several shipping options to suit your needs. Standard delivery takes 5–7 business days 
          and is free on orders over $500. Express delivery (2–3 business days) is available for an 
          additional $15. Store pickup is free—you can collect your order from our Stockholm showroom 
          at your convenience.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Shipping Areas</h2>
        <p>
          We ship throughout Sweden, Norway, Denmark, Finland, and to select European countries. 
          International shipping is available—contact us for rates to your location. Due to the 
          nature of our handcrafted furniture, some items may require white-glove delivery for 
          an additional fee.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Processing Time</h2>
        <p>
          Orders are processed within 2–3 business days. Custom or made-to-order pieces may require 
          additional time—we will notify you of the expected delivery window at checkout. You will 
          receive a tracking number once your order has shipped.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Carbon-Neutral Shipping</h2>
        <p>
          All our shipments are carbon-neutral. We offset the emissions from every delivery through 
          certified environmental projects, so you can enjoy your new furniture with a clear conscience.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-3">Questions?</h2>
        <p>
          If you have any questions about shipping, delivery, or tracking, please contact us at 
          hello@nord-furniture.com or visit our Contact page.
        </p>
      </section>
    </PolicyLayout>
  );
};

export default ShippingPolicy;
