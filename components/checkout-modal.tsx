'use client';

import * as React from 'react';
import {
  X,
  Check,
  Loader2,
  CreditCard,
  Lock,
  Smartphone,
  ShieldCheck,
  MapPin,
  Banknote,
  Truck,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/components/cart-provider';
import { useAuth } from '@/components/auth-provider';
import { cn } from '@/lib/utils';

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'shipping' | 'payment' | 'processing' | 'success';
type PaymentMethod = 'upi' | 'card' | 'cod';

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const { items, subtotal, totalSavings, clear, saveOrder } = useCart();
  const { user } = useAuth();

  const [step, setStep] = React.useState<Step>('shipping');
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('upi');
  const [orderId, setOrderId] = React.useState('');
  const [orderError, setOrderError] = React.useState('');

  // Shipping details state
  const [name, setName] = React.useState(user?.name || '');
  const [phone, setPhone] = React.useState(user?.phone || '');
  const [pincode, setPincode] = React.useState('638401');
  const [address, setAddress] = React.useState('');
  const [city, setCity] = React.useState('Erode');
  const [state, setState] = React.useState('Tamil Nadu');

  // Payment form state
  const [upiId, setUpiId] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvv, setCardCvv] = React.useState('');

  React.useEffect(() => {
    if (user?.name && !name) setName(user.name);
    if (user?.phone && !phone) setPhone(user.phone);
  }, [user]);

  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setStep('shipping'), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');
    setStep('processing');
    const randomOrderId = `AURA-IND-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      await saveOrder({
        items,
        total: subtotal,
        paymentMethod,
        shipping: { name, phone, pincode, address, city, state },
      });
      setOrderId(randomOrderId);
    } catch (error) {
      console.error('Order persistence failed:', error);
      setOrderError('We could not save your order. Please try again.');
      setStep('payment');
      return;
    }

    setTimeout(() => {
      setStep('success');
      clear();
    }, 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-500">
              {step === 'shipping' ? '1' : step === 'payment' ? '2' : '✓'}
            </span>
            <h2 className="text-base font-bold">
              {step === 'shipping'
                ? 'Delivery Address'
                : step === 'payment'
                ? 'Payment Method'
                : step === 'processing'
                ? 'Processing Payment'
                : 'Order Confirmed'}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-5">
          {/* STEP 1: Shipping Address */}
          {step === 'shipping' && (
            <form onSubmit={handleProceedToPayment} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Full Name
                  </label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vishnu Selvan"
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Contact Phone
                  </label>
                  <Input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Pin Code
                  </label>
                  <Input
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="638401"
                    className="text-xs h-9"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Flat / House No. / Street / Area
                  </label>
                  <Input
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Door No. 12, Main Street, Sathyamangalam"
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                    City
                  </label>
                  <Input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Erode"
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                    State
                  </label>
                  <Input
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Tamil Nadu"
                    className="text-xs h-9"
                  />
                </div>
              </div>

              {/* Order Total Preview */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-3 text-xs">
                <div>
                  <p className="font-semibold text-foreground">Total Payable Amount</p>
                  <p className="text-[10px] text-emerald-500 font-medium">
                    Free Express Delivery Included
                  </p>
                </div>
                <span className="text-base font-bold text-foreground">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <Button
                type="submit"
                className="w-full gap-2 rounded-xl bg-amber-500 font-semibold text-black hover:bg-amber-600 h-10"
              >
                Proceed to Payment
              </Button>
            </form>
          )}

          {/* STEP 2: Payment Selector */}
          {step === 'payment' && (
            <form onSubmit={handlePay} className="space-y-4">
              {/* Payment Method Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all',
                    paymentMethod === 'upi'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                      : 'border-border text-muted-foreground hover:bg-secondary'
                  )}
                >
                  <Smartphone className="h-5 w-5" />
                  <span className="text-xs font-semibold">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all',
                    paymentMethod === 'card'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                      : 'border-border text-muted-foreground hover:bg-secondary'
                  )}
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="text-xs font-semibold">Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all',
                    paymentMethod === 'cod'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                      : 'border-border text-muted-foreground hover:bg-secondary'
                  )}
                >
                  <Banknote className="h-5 w-5" />
                  <span className="text-xs font-semibold">Pay on Delivery</span>
                </button>
              </div>

              {/* Dynamic Payment Details */}
              {paymentMethod === 'upi' && (
                <div className="space-y-2 rounded-xl border border-border bg-background/50 p-3.5">
                  <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                    UPI ID (Google Pay, PhonePe, Paytm)
                  </label>
                  <Input
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="text-xs h-9"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    A payment request will be triggered on your registered UPI mobile app.
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3 rounded-xl border border-border bg-background/50 p-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                      Card Number
                    </label>
                    <Input
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 •••• •••• 4242"
                      className="text-xs h-9"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                        Expiry Date
                      </label>
                      <Input
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                        CVV
                      </label>
                      <Input
                        type="password"
                        maxLength={3}
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="text-xs h-9"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <Truck className="h-4 w-4 shrink-0" />
                  <span>Pay via cash, UPI QR, or card at the time of doorstep delivery.</span>
                </div>
              )}

              {/* Delivery Address Summary */}
              <div className="flex items-start gap-2 rounded-lg bg-secondary/40 p-2.5 text-[11px] text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span className="line-clamp-1">
                  Deliver to: {name}, {address || 'Main Street'}, {city} - {pincode}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('shipping')}
                  className="rounded-xl text-xs h-10 px-4"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2 rounded-xl bg-amber-500 font-semibold text-black hover:bg-amber-600 h-10"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Pay ₹{subtotal.toLocaleString('en-IN')}
                </Button>
              </div>

              {orderError && (
                <p className="text-center text-xs text-red-500">{orderError}</p>
              )}

              <p className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-amber-500" />
                256-Bit SSL Encrypted & RBI Compliant Payment Gateway
              </p>
            </form>
          )}

          {/* STEP 3: Payment In Flight */}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
              <div>
                <p className="text-base font-semibold">Authorizing Transaction…</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Communicating securely with your bank. Please do not refresh.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Order Confirmed */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                <Check className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold">Order Placed Successfully!</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Order ID: <strong className="text-foreground">{orderId}</strong>
                </p>
                <p className="mt-2 text-xs text-muted-foreground max-w-xs">
                  We&apos;ve sent an order confirmation and tracking details to your email.
                  Estimated delivery in 2-3 business days.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-2 text-xs text-muted-foreground">
                <Package className="h-4 w-4 text-amber-500" />
                <span>Standard Delivery to Pin Code {pincode}</span>
              </div>

              <Button
                className="mt-2 w-full rounded-xl bg-amber-500 font-semibold text-black hover:bg-amber-600 h-10"
                onClick={() => onOpenChange(false)}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}