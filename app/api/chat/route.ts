import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/config";

// Store catalog aligned with your UI and Rupee (₹) pricing
const CATALOG = [
  {
    name: "Atelier Oxford Shirt",
    price: "₹2,499",
    vibe: "formal, office, classic, shirt, meeting, work, interview, white",
    colors: "optic white",
    pairing: "navy tailored trousers and leather loafers"
  },
  {
    name: "Maison Leather Jacket",
    price: "₹6,999",
    vibe: "party, night, winter, jacket, streetwear, leather, cool, club",
    colors: "obsidian black",
    pairing: "black slim denim and Chelsea boots"
  },
  {
    name: "Riviera Pique Polo",
    price: "₹1,899",
    vibe: "casual, summer, beach, polo, weekend, date, vacation, relax",
    colors: "sage green",
    pairing: "beige chinos or tailored linen shorts"
  },
  {
    name: "Silk Blend Resort Shirt",
    price: "₹1,599",
    vibe: "luxury, summer, floral, party, vacation, dinner, evening",
    colors: "cream botanical",
    pairing: "light linen trousers or tailored shorts"
  },
  {
    name: "Tailored Wool Overshirt",
    price: "₹2,999",
    vibe: "layer, winter, cold, smart casual, modern, minimalist",
    colors: "midnight navy",
    pairing: "dark denim or charcoal wool trousers"
  },
  {
    name: "Relaxed Linen Camp Shirt",
    price: "₹2,199",
    vibe: "beach, hot weather, casual, weekend, day, airy",
    colors: "olive green",
    pairing: "off-white chinos and loafers"
  }
];

export async function POST(req: Request) {
  try {
    const { message, messages } = await req.json();
    const apiKey = APP_CONFIG.GEMINI_API_KEY;
    const rawText = message || (messages && messages[messages.length - 1]?.content) || "";
    const lowerText = rawText.toLowerCase();
    const isGreeting = /^(hi|hello|hey|hiya|good morning|good afternoon|good evening)[!. ,]*$/i.test(rawText.trim());

    if (isGreeting) {
      return NextResponse.json({
        reply: "Hello! I'm your AURA stylist. Tell me what you are shopping for, and I'll help you find the right look."
      });
    }

    // 1. Live LLM Generation via Gemini API (Strict INR constraint)
    if (apiKey && apiKey.startsWith("AIzaSy")) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [{
                text: `You are Aura, an elite AI fashion stylist for a modern luxury brand.
CATALOG: ${JSON.stringify(CATALOG)}
User input: "${rawText}"

Rules:
1. Recommend 1-2 matching items from the CATALOG above.
2. ALWAYS use Indian Rupees (₹) with the exact price listed in the catalog. NEVER use dollar signs ($).
3. Provide pairing styling advice and invite the user to click '✨ AI Virtual Try-On'.
4. Keep the response concise, engaging, and limited to 2-3 sentences.`
              }]
            }]
          })
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return NextResponse.json({ reply });
        }
      } catch (e) {
        console.warn("Live API fallback triggered:", e);
      }
    }

    // 2. Dynamic Rule Matching Engine (INR Fallback)
    let bestMatch = CATALOG[0];
    let highestScore = 0;

    CATALOG.forEach((item) => {
      let score = 0;
      item.vibe.split(", ").forEach((tag) => {
        if (lowerText.includes(tag)) score += 2;
      });
      item.name.toLowerCase().split(" ").forEach((word) => {
        if (lowerText.includes(word)) score += 3;
      });
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    });

    if (highestScore === 0) {
      bestMatch = CATALOG[Math.floor(Math.random() * CATALOG.length)];
    }

    const intros = [
      `For that look, I'd style you with the **${bestMatch.name}** (${bestMatch.price}) in ${bestMatch.colors}.`,
      `I recommend our **${bestMatch.name}** (${bestMatch.price}) to match that aesthetic.`,
      `A standout option is our **${bestMatch.name}** (${bestMatch.price}) in ${bestMatch.colors}.`,
      `You should definitely check out the **${bestMatch.name}** (${bestMatch.price}).`
    ];

    const intro = intros[Math.floor(Math.random() * intros.length)];
    const pairingAdvice = `Pair it with ${bestMatch.pairing} for a clean, balanced look.`;
    const cta = `Try clicking **'✨ AI Virtual Try-On'** on its card to visualize the fit!`;

    return NextResponse.json({
      reply: `${intro} ${pairingAdvice} ${cta}`
    });
  } catch (err: any) {
    return NextResponse.json({
      reply: "I recommend exploring our **Atelier Oxford Shirt** (₹2,499) for a crisp, timeless profile. Click '✨ AI Virtual Try-On' to preview the fit!"
    });
  }
}