"use client";

import { useCart } from "@/lib/store";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { PrimaryButton } from "@/components/ui/button";

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart, getTotal } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-12">
      <div className="space-y-6">
        <h3 className="text-xl font-black tracking-tighter uppercase leading-none border-b border-sage pb-4">
          01. Shipping Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="FULL NAME"
            className="w-full bg-bone border border-sage p-4 text-xs font-bold focus:outline-none focus:border-deep-olive"
            required
          />
          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            className="w-full bg-bone border border-sage p-4 text-xs font-bold focus:outline-none focus:border-deep-olive"
            required
          />
          <input
            type="text"
            placeholder="SHIPPING ADDRESS"
            className="w-full md:col-span-2 bg-bone border border-sage p-4 text-xs font-bold focus:outline-none focus:border-deep-olive"
            required
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black tracking-tighter uppercase leading-none border-b border-sage pb-4">
          02. Payment Details
        </h3>
        {/* Stripe Elements will be injected here */}
        <div className="p-4 border border-sage">
          <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
        </div>
      </div>

      <PrimaryButton
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full py-6 text-sm tracking-[0.2em] font-black uppercase"
      >
        {isLoading ? "PROCESSING..." : `CONFIRM AND PAY $${getTotal().toFixed(2)}`}
      </PrimaryButton>

      {message && (
        <div id="payment-message" className="text-xs font-bold uppercase tracking-widest text-red-500 mt-4">
          {message}
        </div>
      )}
    </form>
  );
};

export const OrderSummary = () => {
  const { items, getTotal } = useCart();

  return (
    <div className="bg-clay/10 border border-sage p-8 h-fit sticky top-32">
      <h3 className="text-xl font-black tracking-tighter uppercase leading-none border-b border-sage pb-6 mb-8">
        Order Summary
      </h3>
      
      <div className="space-y-6 mb-12">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-start text-xs font-bold uppercase tracking-widest">
            <div className="flex gap-4">
              <span className="text-sage">x{item.quantity}</span>
              <span>{item.name}</span>
            </div>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-6 border-t border-sage">
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-sage">
          <span>SUBTOTAL</span>
          <span>${getTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-sage">
          <span>SHIPPING</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between text-lg font-black uppercase tracking-tighter text-deep-olive pt-4">
          <span>TOTAL</span>
          <span>${getTotal().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
