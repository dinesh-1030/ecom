import { Sparkles, ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-neutral-950 text-neutral-300">
      {/* Top Marketplace Value Strip */}
      <div className="border-b border-neutral-800/80 bg-neutral-900/40 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-100">
                  AI Virtual Try-On
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Instant realistic fitting on your uploaded photos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-100">
                  100% Genuine Guarantee
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Handcrafted from certified luxury fabrics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-100">
                  14-Day Easy Returns
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Hassle-free doorstep pickup across India
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-100">
                  Express Pan-India Shipping
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Delivered safely to over 19,000 pin codes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Directory */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 font-black text-black text-base">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-white">AURA</span>
                <span className="text-[9px] -mt-1 font-bold uppercase tracking-widest text-amber-500">
                  Luxe Studio
                </span>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-xs leading-relaxed text-neutral-400">
              India&apos;s first conversational fashion marketplace merging diffusion-based
              virtual fitting rooms with an autonomous AI stylist for tailor-made shopping.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
              <Lock className="h-3.5 w-3.5 text-amber-500" />
              <span>PCI-DSS Compliant 256-Bit Encrypted Payments</span>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-100">
              Collections
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-neutral-400">
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Men&apos;s Oxford Shirts
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Italian Leather Jackets
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Mulberry Silk Blouses
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Tailored Wool Blazers
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Breathable Pique Polos
                </a>
              </li>
            </ul>
          </div>

          {/* AI Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-100">
              AI Innovations
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-neutral-400">
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Virtual Fitting Room
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Gemini Fashion Advisor
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Pose & Fit Segmentation
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Custom Size Mapping
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-100">
              Customer Policies
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-neutral-400">
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Track Your Order
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Shipping & Customs
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Privacy Policy & Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip: Payment Icons & Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800/80 pt-6 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} AURA Luxe Studio Inc. All rights reserved.</p>

          <div className="flex items-center gap-3 text-[11px] font-medium text-neutral-400">
            <span className="rounded bg-neutral-900 px-2 py-1 border border-neutral-800">UPI</span>
            <span className="rounded bg-neutral-900 px-2 py-1 border border-neutral-800">RuPay</span>
            <span className="rounded bg-neutral-900 px-2 py-1 border border-neutral-800">Visa / Mastercard</span>
            <span className="rounded bg-neutral-900 px-2 py-1 border border-neutral-800">Net Banking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}