"use client";

import { useEffect, useState } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "@/lib/store";
import { CheckoutForm, OrderSummary } from "@/components/checkout/checkout-components";

// Replace with your real public key once available
const stripePromise = loadStripe("pk_test_placeholder");

export default function CheckoutPage() {
  const { getTotal, items } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // When backend is ready, fetch payment intent secret here:
    // fetch("/api/payments/create-intent", { method: "POST", ... })
    //   .then((res) => res.json())
    //   .then((data) => setClientSecret(data.clientSecret));
    
    // For now, we simulate a state that shows the Elements provider
    // Once integrated, clientSecret will be required.
  }, [getTotal()]);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 italic">Your collection is empty.</h1>
        <a href="/shop" className="text-xs font-bold uppercase tracking-widest underline underline-offset-8 hover:text-sage transition-colors">Return to Marketplace</a>
      </div>
    );
  }

  const appearance = {
    theme: "none" as const,
    variables: {
      fontFamily: "var(--font-geist-sans), sans-serif",
      spacingUnit: "4px",
      borderRadius: "0px",
      colorPrimary: "#25291C",
      colorBackground: "#E3E7D3",
      colorText: "#25291C",
      colorDanger: "#df1b41",
    },
    rules: {
      ".Input": {
        border: "1px solid #989C94",
        backgroundColor: "#E3E7D3",
        fontSize: "12px",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        padding: "16px",
      },
      ".Input:focus": {
        border: "1px solid #25291C",
        boxShadow: "none",
      },
      ".Label": {
        fontSize: "10px",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        color: "#989C94",
        marginBottom: "8px",
      },
    },
  };

  const options: StripeElementsOptions = {
    clientSecret: "pi_test_secret_placeholder", // For display purposes only
    appearance,
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-16 border-b border-sage pb-8">
            Checkout Process
          </h2>
          {/* We wrap with Elements. Since clientSecret is mock, this might log warnings but shows the layout */}
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
        
        <div className="lg:col-span-4">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
