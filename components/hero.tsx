'use client';

import * as React from 'react';
import { ArrowRight, Sparkles, Wand2, ShieldCheck, Truck, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onShopNow: () => void;
  onOpenStylist: () => void;
}

export function Hero({ onShopNow, onOpenStylist }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-card/80 via-background to-background">
      {/* Ambient gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="absolute right-0 top-32 h-[400px] w-[400px] rounded-full bg-amber-600/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Sale Announcement Badge */}
          <div className="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-500 backdrop-blur">
            <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            END OF SEASON SALE — FLAT 50% OFF + AI FITTING
          </div>

          <h1
            className="animate-fade-up text-balance text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
            style={{ animationDelay: '60ms' }}
          >
            Dress with an{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
              AI stylist
            </span>{' '}
            that knows you.
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl animate-fade-up text-balance text-base text-muted-foreground sm:text-lg"
            style={{ animationDelay: '120ms' }}
          >
            Discover curated luxury apparel, converse with our Gemini-powered stylist for
            personalized fashion advice, and virtually try on every garment on your own photo in seconds.
          </p>

          {/* Action CTAs */}
          <div
            className="mt-8 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: '180ms' }}
          >
            <Button
              size="lg"
              onClick={onShopNow}
              className="group gap-2 rounded-full bg-amber-500 px-7 font-semibold text-black hover:bg-amber-600 shadow-lg shadow-amber-500/20"
            >
              Shop Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onOpenStylist}
              className="gap-2 rounded-full border-border/80 px-7 font-medium hover:bg-secondary"
            >
              <Wand2 className="h-4 w-4 text-amber-500" />
              Try AI Stylist
            </Button>
          </div>

          {/* Trust Badges Bar */}
          <div
            className="mt-12 grid grid-cols-3 gap-4 border-t border-border/80 pt-8 text-left sm:text-center"
            style={{ animationDelay: '240ms' }}
          >
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1.5 text-foreground">
                <ShieldCheck className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-bold">100% Genuine</span>
              </div>
              <span className="text-xs text-muted-foreground">Certified Luxury Brands</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 border-x border-border/60">
              <div className="flex items-center gap-1.5 text-foreground">
                <Truck className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-bold">Express Delivery</span>
              </div>
              <span className="text-xs text-muted-foreground">Across All Indian Pin Codes</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1.5 text-foreground">
                <RotateCcw className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-bold">14-Day Returns</span>
              </div>
              <span className="text-xs text-muted-foreground">Instant Doorstep Pickup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}