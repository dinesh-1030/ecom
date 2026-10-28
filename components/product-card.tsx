'use client';

import * as React from 'react';
import { Plus, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/cart-provider';
import type { Product } from '@/lib/products';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onTryOn: (product: Product) => void;
}

export function ProductCard({ product, onTryOn }: ProductCardProps) {
  const { add } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAdd = () => {
    const size = product.sizes[0];
    const color = product.colors[0]?.name || 'Default';
    add(product, size, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="border-border/60 bg-background/80 backdrop-blur"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            size="sm"
            className="flex-1 gap-1.5 rounded-full backdrop-blur"
            onClick={() => onTryOn(product)}
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            AI Virtual Try-On
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium leading-tight">{product.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {product.category} · {product.gender}
            </p>
          </div>
          <span className="shrink-0 text-base font-semibold">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="mt-auto pt-4">
          <Button
            onClick={handleAdd}
            variant="outline"
            className="w-full gap-2 rounded-full"
          >
            {added ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}