'use client';

import * as React from 'react';
import { Sparkles, X, Send, Loader2, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products, type Product } from '@/lib/products';
import { cn } from '@/lib/utils';

interface StylistDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTryOn?: (product: Product) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Suggest a formal shirt for office meetings',
  'What jacket pairs well for a night out party?',
  'I need a breathable polo for a weekend trip',
  'Show me luxury silk pieces for an evening dinner',
];

export function StylistDrawer({ open, onOpenChange, onTryOn }: StylistDrawerProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi, I'm your AURA stylist. Ask me about any piece in our collection, request outfit pairings, or get sizing advice in ₹ (INR). How can I style you today?",
    },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const next: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setInput('');

    if (/^(hi|hello|hey|hiya|good morning|good afternoon|good evening)[!. ,]*$/i.test(trimmed)) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Hello! I'm your AURA stylist. Tell me what you are shopping for, and I'll help you find the right look.",
        },
      ]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      const content =
        data.reply ||
        (data.error
          ? `Sorry — I hit a snag reaching my styling engine (${data.error}). Please try again.`
          : 'I could not generate a recommendation right now. Could you rephrase your question?');
      setMessages((prev) => [...prev, { role: 'assistant', content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I couldn't reach the styling assistant right now. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Detects if a message mentions a store item to display a direct Try-On shortcut
  const getMentionedProduct = (content: string): Product | undefined => {
    return products.find((p) =>
      content.toLowerCase().includes(p.name.toLowerCase())
    );
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => onOpenChange(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg shadow-black/30 transition-all duration-300 hover:scale-105 hover:bg-amber-400',
          open && 'pointer-events-none scale-0 opacity-0'
        )}
        aria-label="Open AI stylist"
      >
        <Sparkles className="h-6 w-6" />
        <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-amber-500 ring-2 ring-background" />
        </span>
      </button>

      {/* Stylist Drawer */}
      <div
        className={cn(
          'fixed bottom-0 right-0 z-50 flex h-[580px] max-h-[90vh] w-full flex-col rounded-t-2xl border border-border/60 bg-card shadow-2xl transition-all duration-300 sm:bottom-6 sm:right-6 sm:h-[620px] sm:w-[420px] sm:rounded-2xl',
          open
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-8 opacity-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-500">
              <Sparkles className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">AURA Stylist</p>
              <p className="text-xs text-muted-foreground">Personal AI Fashion Consultant</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m, i) => {
            const mentionedProduct = m.role === 'assistant' ? getMentionedProduct(m.content) : undefined;

            return (
              <div
                key={i}
                className={cn(
                  'flex flex-col',
                  m.role === 'user' ? 'items-end' : 'items-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    m.role === 'user'
                      ? 'rounded-br-md bg-primary text-primary-foreground'
                      : 'rounded-bl-md bg-secondary text-secondary-foreground'
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>

                {/* Direct Try-On Action Card */}
                {mentionedProduct && onTryOn && (
                  <div className="mt-2 flex max-w-[88%] items-center gap-2.5 rounded-xl border border-border/70 bg-background/60 p-2 shadow-sm backdrop-blur">
                    <img
                      src={mentionedProduct.image}
                      alt={mentionedProduct.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{mentionedProduct.name}</p>
                      <p className="text-[11px] text-muted-foreground">₹{mentionedProduct.price.toLocaleString('en-IN')}</p>
                    </div>
                    <Button
                      size="sm"
                      className="h-7 gap-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-[11px] font-medium px-2.5"
                      onClick={() => {
                        onTryOn(mentionedProduct);
                      }}
                    >
                      <Shirt className="h-3.5 w-3.5" />
                      Try On
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            </div>
          )}

          {/* Quick Prompts */}
          {messages.length <= 1 && !loading && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-medium text-muted-foreground">
                Style inspiration prompts:
              </p>
              <div className="flex flex-col gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left rounded-xl border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t border-border/60 p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for advice, pairings, sizing..."
              className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full bg-amber-500 hover:bg-amber-600 text-black shrink-0"
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          <div className="mt-2 flex flex-wrap gap-1.5 overflow-x-auto">
            {products.slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => send(`Style advice for the ${p.name}`)}
                className="rounded-full bg-secondary/50 px-2.5 py-1 text-[0.7rem] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground truncate max-w-[130px]"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}