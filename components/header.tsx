'use client';

import * as React from 'react';
import {
  ShoppingBag,
  Sparkles,
  MapPin,
  User,
  Heart,
  LogOut,
  Package,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useCart } from '@/components/cart-provider';
import { useAuth } from '@/components/auth-provider';

interface HeaderProps {
  onOpenStylist: () => void;
}

export function Header({ onOpenStylist }: HeaderProps) {
  const { count, setOpen: setCartOpen } = useCart();
  const { user, isAuthenticated, openLogin, logout } = useAuth();
  const [profileDropdown, setProfileDropdown] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 font-black text-black text-lg">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight">AURA</span>
              <span className="text-[9px] -mt-1 font-bold uppercase tracking-widest text-amber-500">
                Luxe Studio
              </span>
            </div>
          </a>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#catalog" className="transition-colors hover:text-foreground">
            Collection
          </a>
          <a href="#stylist" onClick={onOpenStylist} className="transition-colors hover:text-foreground">
            AI Stylist
          </a>
          <a href="#catalog" className="transition-colors hover:text-foreground">
            Virtual Try-On
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Ask Stylist Trigger */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenStylist}
            className="hidden gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 sm:flex text-xs font-semibold h-9"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            Ask Stylist
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Auth Profile / Login Button */}
          <div className="relative">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-2 rounded-full border border-border p-1 pr-2 hover:bg-secondary transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-7 w-7 rounded-full bg-neutral-800"
                  />
                  <div className="text-left hidden md:block">
                    <span className="block text-xs font-semibold truncate max-w-[90px]">
                      {user.name}
                    </span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card p-1.5 shadow-xl z-50">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-xs font-semibold">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={() => setProfileDropdown(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      <Package className="h-3.5 w-3.5" />
                      My Orders
                    </button>
                    <button
                      onClick={() => setProfileDropdown(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      <Heart className="h-3.5 w-3.5" />
                      Wishlist
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdown(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={openLogin}
                className="gap-1.5 rounded-full text-xs font-semibold h-9"
              >
                <User className="h-3.5 w-3.5" />
                Sign In
              </Button>
            )}
          </div>

          {/* Cart Bag */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCartOpen(true)}
            className="relative rounded-full border border-border h-9 w-9"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-black">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}