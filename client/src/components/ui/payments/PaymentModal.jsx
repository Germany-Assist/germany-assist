import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ShieldCheck, Lock, X } from "lucide-react";
import { STRIPE_KEY } from "../../../config/api";
import StatusModal from "../StatusModal";

const stripePromise = loadStripe(STRIPE_KEY);

// 2. The Checkout Form logic
const CheckoutForm = ({ clientSecret, onPaymentSuccess, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else if (result.paymentIntent.status === "succeeded") {
      setLoading(false);
      onPaymentSuccess(); // Trigger the success screen
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Card Details
        </label>
        <div className="rounded-2xl border border-light-200 bg-white p-5 dark:border-white/5 dark:bg-dark-900 shadow-inner">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  fontFamily: "Inter, sans-serif",
                  color: window.matchMedia("(prefers-color-scheme: dark)")
                    .matches
                    ? "#000000"
                    : "#000000",
                  "::placeholder": { color: "#94a3b8" },
                },
              },
            }}
          />
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500 font-bold uppercase tracking-tighter bg-red-500/10 p-3 rounded-xl">
          {error}
        </p>
      )}
      <button
        disabled={loading}
        className="w-full bg-blue-600 py-5 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-500/25 disabled:grayscale disabled:opacity-50"
      >
        {loading ? "Verifying..." : `Pay $${amount}`}
      </button>
      <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <Lock size={12} /> SSL Secure Payment
      </div>
    </form>
  );
};

// 3. The Main Modal Controller
const PaymentModal = ({ isOpen, onClose, clientSecret, amount }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => {
    onClose();
    setTimeout(() => setIsSuccess(false), 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-light-950/60 backdrop-blur-md dark:bg-black/80 animate-in fade-in"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-dark-950 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/5 animate-in zoom-in-95">
        <button
          onClick={handleClose}
          className="absolute right-8 top-8 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        {!isSuccess ? (
          <>
            <div className="p-10 pb-0">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Checkout
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8 italic">
                Complete your transaction securely.
              </p>
            </div>
            <div className="bg-light-50/50 dark:bg-white/5 p-10 pt-8">
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  clientSecret={clientSecret}
                  onPaymentSuccess={() => setIsSuccess(true)}
                  amount={amount}
                />
              </Elements>
            </div>
          </>
        ) : (
          <div className="p-10">
            <StatusModal
              isOpen={isSuccess}
              onClose={handleClose}
              type={"success"}
              message="Congratulations Your Payment was received and your booking is confirmed."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
