'use client';

import * as React from 'react';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { Catalog } from '@/components/catalog';
import { StylistDrawer } from '@/components/stylist-drawer';
import { TryOnModal } from '@/components/try-on-modal';
import { CartDrawer } from '@/components/cart-drawer';
import { CheckoutModal } from '@/components/checkout-modal';
import { AuthModal } from '@/components/auth-modal';
import { Footer } from '@/components/footer';
import type { Product } from '@/lib/products';

export default function Home() {
  const [stylistOpen, setStylistOpen] = React.useState(false);
  const [tryOnOpen, setTryOnOpen] = React.useState(false);
  const [tryOnProduct, setTryOnProduct] = React.useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);

  const openTryOn = (product: Product) => {
    setTryOnProduct(product);
    setTryOnOpen(true);
  };

  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-amber-500/20 selection:text-amber-500">
      <Header onOpenStylist={() => setStylistOpen(true)} />

      <main>
        <Hero
          onShopNow={scrollToCatalog}
          onOpenStylist={() => setStylistOpen(true)}
        />
        <div id="catalog">
          <Catalog onTryOn={openTryOn} />
        </div>
      </main>

      <Footer />

      {/* User Authentication Modal */}
      <AuthModal />

      {/* AI Stylist Assistant */}
      <StylistDrawer
        open={stylistOpen}
        onOpenChange={setStylistOpen}
        onTryOn={openTryOn}
      />

      {/* Virtual Try-On Diffusion Studio */}
      <TryOnModal
        product={tryOnProduct}
        open={tryOnOpen}
        onOpenChange={setTryOnOpen}
      />

      {/* Cart & Checkout */}
      <CartDrawer
        onCheckout={() => {
          setCheckoutOpen(true);
        }}
      />
      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
      />
    </div>
  );
}