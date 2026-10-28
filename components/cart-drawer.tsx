'use client';

import * as React from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/components/cart-provider';
import { useAuth } from '@/components/auth-provider';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
  onCheckout: () => void;
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const {
    items,
    isOpen,
    setOpen,
    remove,
    updateQty,
    subtotal,
    totalSavings,
    count,
  } = useCart();
  const { isAuthenticated, openLogin } = useAuth();
  const [couponCode, setCouponCode] = React.useState('');
  const [couponApplied, setCouponApplied] = React.useState(false);
  const [couponError, setCouponError] = React.useState<string | null>(null);

  const discountAmount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);

    if (!couponCode.trim()) return;

    if (couponCode.trim().toUpperCase() === 'AURA10') {
      setCouponApplied(true);
      setCouponError(null);
    } else {
      setCouponApplied(false);
      setCouponError('Invalid promo code. Try "AURA10" for 10% off.');
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setOpen(false);
      openLogin();
      return;
    }
    setOpen(false);
    onCheckout();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setOpen(false)}
      />

      {/* Side Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border/80 bg-card shadow-2xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-bold">Shopping Bag</h2>
            {count > 0 && (
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Savings Ribbon */}
        {totalSavings > 0 && (
          <div className="flex items-center gap-2 border-b border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>
              You are saving ₹{totalSavings.toLocaleString('en-IN')} on this order!
            </span>
          </div>
        )}

        {/* Cart Item List */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-base font-semibold">Your bag is empty</p>
            <p className="max-w-[220px] text-xs text-muted-foreground">
              Explore our luxury catalog and try on styles virtually to fill your bag.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 rounded-full text-xs font-semibold"
              onClick={() => setOpen(false)}
            >
              Browse Collection
            </Button>
          </div>
        ) : (
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {items.map((item, idx) => {
              const itemPrice = typeof item.product.price === 'number' ? item.product.price : 0;
              const itemOriginalPrice =
                typeof item.product.originalPrice === 'number'
                  ? item.product.originalPrice
                  : itemPrice;
              const itemQty = item.quantity || 1;

              return (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}-${idx}`}
                  className="flex gap-3 rounded-xl border border-border/80 bg-background/50 p-3"
                >
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {item.product.brand || 'AURA'}
                          </span>
                          <p className="text-xs font-medium leading-tight line-clamp-1">
                            {item.product.name}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            remove(item.product.id, item.size, item.color)
                          }
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Size: <strong className="text-foreground">{item.size}</strong> · Color:{' '}
                        <strong className="text-foreground">{item.color}</strong>
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-bold text-foreground">
                          ₹{(itemPrice * itemQty).toLocaleString('en-IN')}
                        </span>
                        {itemOriginalPrice > itemPrice && (
                          <span className="text-[10px] text-muted-foreground line-through">
                            ₹{(itemOriginalPrice * itemQty).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-1 py-0.5">
                        <button
                          onClick={() =>
                            updateQty(
                              item.product.id,
                              item.size,
                              item.color,
                              itemQty - 1
                            )
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-secondary"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-semibold">
                          {itemQty}
                        </span>
                        <button
                          onClick={() =>
                            updateQty(
                              item.product.id,
                              item.size,
                              item.color,
                              itemQty + 1
                            )
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-secondary"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Drawer Footer & Bill Summary */}
        {items.length > 0 && (
          <div className="space-y-3 border-t border-border bg-card p-4">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Promo Code (Try: AURA10)"
                    className="h-8 pl-8 text-xs uppercase"
                  />
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  className="h-8 px-3 text-xs font-semibold"
                >
                  Apply
                </Button>
              </div>
              {couponApplied && (
                <p className="text-[11px] font-medium text-emerald-500">
                  ✓ Coupon &apos;AURA10&apos; applied (10% discount)
                </p>
              )}
              {couponError && (
                <p className="text-[11px] font-medium text-red-400">
                  {couponError}
                </p>
              )}
            </form>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Total MRP</span>
                <span>
                  ₹{(subtotal + totalSavings).toLocaleString('en-IN')}
                </span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount on MRP</span>
                  <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
              )}
              {couponApplied && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Charges</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  FREE
                </span>
              </div>
              <div className="flex justify-between border-t border-border/80 pt-2 text-sm font-bold text-foreground">
                <span>Total Payable</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Button
              onClick={handleProceedToCheckout}
              className="w-full gap-2 rounded-xl bg-amber-500 font-semibold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-600"
              size="lg"
            >
              <span>
                {isAuthenticated ? 'Proceed to Checkout' : 'Login & Checkout'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              <span>Safe and Secure Payments • 100% Authentic Products</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}