'use client';

import * as React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import {
  products,
  categories,
  genders,
  type Product,
  type Category,
  type Gender,
} from '@/lib/products';
import { cn } from '@/lib/utils';

interface CatalogProps {
  onTryOn: (product: Product) => void;
}

export function Catalog({ onTryOn }: CatalogProps) {
  const [category, setCategory] = React.useState<'All' | Category>('All');
  const [gender, setGender] = React.useState<'All' | Gender>('All');
  const [priceRange, setPriceRange] = React.useState<'All' | 'Under 2000' | '2000-5000' | 'Above 5000'>('All');
  const [showFilters, setShowFilters] = React.useState(false);

  const filtered = React.useMemo(
    () =>
      products.filter((p) => {
        const categoryMatch = category === 'All' || p.category === category;
        const genderMatch = gender === 'All' || p.gender === gender;
        const priceMatch =
          priceRange === 'All' ||
          (priceRange === 'Under 2000' && p.price < 2000) ||
          (priceRange === '2000-5000' && p.price >= 2000 && p.price <= 5000) ||
          (priceRange === 'Above 5000' && p.price > 5000);

        return categoryMatch && genderMatch && priceMatch;
      }),
    [category, gender, priceRange]
  );

  return (
    <section id="catalog" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            The Collection
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {filtered.length} piece{filtered.length !== 1 && 's'} curated for
            the season.
          </p>
        </div>

        <div className="relative flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((prev) => !prev)}
            className="rounded-full px-4 text-xs font-medium"
          >
            <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
            Filter
          </Button>

          {showFilters && (
            <div className="absolute right-0 top-12 z-20 w-[320px] rounded-2xl border border-border/80 bg-card p-3 shadow-xl">
              <div className="space-y-3">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['All', ...categories.filter((c) => c !== 'All')].map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCategory(c as 'All' | Category);
                        }}
                        className={cn(
                          'rounded-full border px-2.5 py-1 text-[11px] font-medium',
                          category === c
                            ? 'border-amber-500 bg-amber-500 text-black'
                            : 'border-border bg-background text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Gender
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {genders.map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={cn(
                          'rounded-full border px-2.5 py-1 text-[11px] font-medium',
                          gender === g
                            ? 'border-amber-500 bg-amber-500 text-black'
                            : 'border-border bg-background text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Price
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(['All', 'Under 2000', '2000-5000', 'Above 5000'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setPriceRange(range)}
                        className={cn(
                          'rounded-full border px-2.5 py-1 text-[11px] font-medium',
                          priceRange === range
                            ? 'border-amber-500 bg-amber-500 text-black'
                            : 'border-border bg-background text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
          <p className="text-lg font-medium">No pieces match those filters.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your selection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onTryOn={onTryOn} />
          ))}
        </div>
      )}
    </section>
  );
}
