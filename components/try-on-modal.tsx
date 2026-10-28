'use client';

import * as React from 'react';
import {
  X,
  Upload,
  Sparkles,
  Loader2,
  ImageIcon,
  Check,
  AlertTriangle,
  ShoppingBag,
  RefreshCw,
  Image as FileImageIcon,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/cart-provider';
import type { Product } from '@/lib/products';
import { cn } from '@/lib/utils';

interface TryOnModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Status = 'idle' | 'loading' | 'done' | 'error';

export function TryOnModal({ product, open, onOpenChange }: TryOnModalProps) {
  const { add } = useCart();
  const [modelImage, setModelImage] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<Status>('idle');
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const [stepText, setStepText] = React.useState('Connecting to AI GPU cluster...');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [addedToBag, setAddedToBag] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const productBrand = (product as any)?.brand || 'AURA';
  const discountVal = (product as any)?.discountPercent || null;

  React.useEffect(() => {
    if (!open) {
      setStatus('idle');
      setResult(null);
      setErrorMessage(null);
      setElapsedSeconds(0);
      setModelImage(null);
    }
  }, [open]);

  React.useEffect(() => {
    if (product) {
      setModelImage(null);
      setStatus('idle');
      setResult(null);
      setErrorMessage(null);
      setElapsedSeconds(0);
    }
  }, [product?.id, open]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      setModelImage(reader.result as string);
      setResult(null);
      setErrorMessage(null);
      setStatus('idle');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const generate = async () => {
    if (!modelImage || !product) return;

    setStatus('loading');
    setErrorMessage(null);
    setResult(null);
    setElapsedSeconds(0);
    setStepText('Connecting to Hugging Face GPU space...');

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next === 6) setStepText('Isolating human body pose & geometry...');
        if (next === 18) setStepText('Running 30 IDM-VTON diffusion denoising steps...');
        if (next === 35) setStepText('Blending garment fabric textures & lighting...');
        if (next === 50) setStepText('Finalizing rendered output image...');
        return next;
      });
    }, 1000);

    try {
      const res = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentImage: product.image,
          modelImage: modelImage,
          productName: product.name,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'AI Virtual Try-On generation failed.');
      }

      const finalImage = data.resultImage || data.url;
      if (!finalImage) {
        throw new Error('No image was returned by the GPU pipeline.');
      }

      setResult(finalImage);
      setStatus('done');
    } catch (err: any) {
      console.error('AI Try-On Error:', err);
      setErrorMessage(
        err.message || 'AI generation failed. The GPU cluster may be busy.'
      );
      setStatus('error');
    } finally {
      clearInterval(timer);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0]?.name || 'Default';
    add(product, defaultSize, defaultColor);
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 1600);
  };

  const formattedPrice = product
    ? typeof product.price === 'number'
      ? `₹${product.price.toLocaleString('en-IN')}`
      : product.price
    : '';

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl animate-scale-in flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 text-neutral-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-500">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold leading-tight">
                AI Virtual Try-On Studio
              </h2>
              <p className="text-xs text-neutral-400">
                {product.name} · {formattedPrice}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Studio Body */}
        <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-5 md:grid-cols-2">
          {/* Left Column: Product Info & Image Upload */}
          <div className="flex flex-col gap-4">
            {/* Target Product Summary Card */}
            <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-2.5">
              <img
                src={product.image}
                alt={product.name}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  {productBrand}
                </span>
                <h4 className="truncate text-xs font-semibold">{product.name}</h4>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-neutral-800 px-1.5 py-0 text-[10px] text-neutral-300"
                  >
                    {product.category}
                  </Badge>
                  {discountVal && (
                    <span className="text-[10px] font-bold text-orange-400">
                      {discountVal}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Photo Upload Area */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-xs font-medium text-neutral-400">
                  Your Portrait Photo
                </p>
                {modelImage && (
                  <button
                    onClick={() => setModelImage(null)}
                    className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-3 w-3" /> Remove Photo
                  </button>
                )}
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={cn(
                  'relative flex h-60 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all',
                  dragOver
                    ? 'border-amber-500 bg-amber-500/10'
                    : modelImage
                    ? 'border-neutral-700 bg-neutral-900'
                    : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/70'
                )}
              >
                {modelImage ? (
                  <>
                    <img
                      src={modelImage}
                      alt="Uploaded Portrait"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-neutral-100">
                        <Upload className="h-4 w-4" /> Change Photo
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2.5 p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800/80 text-neutral-400">
                      <FileImageIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-200">
                        No photo selected
                      </p>
                      <p className="mt-0.5 text-[11px] text-neutral-400">
                        Click or drag your portrait photo here to upload
                      </p>
                    </div>
                    <span className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-500">
                      JPG, PNG up to 10MB
                    </span>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </div>

              {/* Photo Guidelines */}
              <div className="mt-3.5 rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3 text-[11px] text-neutral-400">
                <p className="mb-1 font-semibold text-neutral-200 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  📸 Photo Guidelines for Accurate Fit:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-0.5 text-neutral-400">
                  <li>Use a waist-up or full-body vertical portrait.</li>
                  <li>Keep arms naturally at your sides (avoid crossed arms).</li>
                  <li>Ensure neck, shoulders, and chest are unobstructed.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Generation Canvas & Actions */}
          <div className="flex flex-col gap-4">
            <Button
              onClick={generate}
              disabled={!modelImage || status === 'loading'}
              className="h-11 w-full gap-2 rounded-xl bg-amber-500 font-semibold text-black shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-600 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Synthesizing AI Fit ({elapsedSeconds}s)…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {modelImage ? 'Generate AI Fit on My Photo' : 'Upload a Photo to Try On'}
                </>
              )}
            </Button>

            {/* Canvas Output */}
            <div className="relative flex h-72 w-full flex-1 items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
              {status === 'idle' && (
                <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <ImageIcon className="h-8 w-8 text-neutral-600" />
                  <p className="text-xs text-neutral-400">
                    {modelImage
                      ? 'Click "Generate AI Fit on My Photo" to start synthesis'
                      : 'Upload a portrait photo on the left to start'}
                  </p>
                </div>
              )}

              {status === 'loading' && (
                <div className="flex w-full max-w-xs flex-col items-center justify-center gap-3 p-6 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                  <p className="text-xs font-semibold text-amber-400">{stepText}</p>
                  <p className="font-mono text-[11px] text-neutral-400">
                    Elapsed time: {elapsedSeconds}s
                  </p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(95, (elapsedSeconds / 45) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="flex flex-col items-center justify-center gap-2 p-5 text-center">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                  <p className="text-xs font-medium text-red-300">{errorMessage}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generate}
                    className="mt-2 border-neutral-700 text-xs hover:bg-neutral-800"
                  >
                    Retry Render
                  </Button>
                </div>
              )}

              {status === 'done' && result && (
                <div className="relative flex h-full w-full items-center justify-center bg-black">
                  <img
                    src={result}
                    alt="AI Virtual Try-On Output"
                    className="h-full w-full object-contain"
                  />
                  <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[11px] font-semibold text-black backdrop-blur">
                    <Check className="h-3 w-3 stroke-[3]" />
                    100% AI Synthesized
                  </div>
                </div>
              )}
            </div>

            {/* Cart & Completion Actions */}
            <div className="space-y-2 pt-1">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="h-10 w-full gap-2 rounded-xl border-neutral-700 bg-neutral-900 text-xs font-semibold text-neutral-100 hover:bg-neutral-800"
              >
                {addedToBag ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500" />
                    Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 text-amber-500" />
                    Add Fitted Outfit to Bag ({formattedPrice})
                  </>
                )}
              </Button>

              {status === 'done' && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-1.5 rounded-xl border border-neutral-800 text-xs text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                    onClick={generate}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Regenerate Fit
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl bg-amber-500 text-xs font-semibold text-black hover:bg-amber-600"
                    onClick={() => onOpenChange(false)}
                  >
                    Looks Great
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}