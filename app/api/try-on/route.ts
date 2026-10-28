// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/config";
import { Client, handle_file } from "@gradio/client";
import fs from "fs";
import path from "path";
import os from "os";

export const runtime = "nodejs";
export const maxDuration = 180;

interface TryOnBody {
  garmentImage?: string;
  modelImage?: string;
  productName?: string;
}

async function saveTempFile(input: string, prefix: string): Promise<string> {
  const tempPath = path.join(
    os.tmpdir(),
    `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`
  );

  if (input.startsWith("data:")) {
    const commaIndex = input.indexOf(",");
    const base64Data = commaIndex !== -1 ? input.slice(commaIndex + 1) : input;
    await fs.promises.writeFile(tempPath, Buffer.from(base64Data, "base64"));
    return tempPath;
  }

  if (input.startsWith("/")) {
    const cleanPath = input.slice(1);
    const localPublicFile = path.join(process.cwd(), "public", cleanPath);
    if (fs.existsSync(localPublicFile)) {
      await fs.promises.copyFile(localPublicFile, tempPath);
      return tempPath;
    }
  }

  if (input.startsWith("http://") || input.startsWith("https://")) {
    const res = await fetch(input);
    if (!res.ok) throw new Error(`Failed to fetch image: ${input}`);
    const arrayBuffer = await res.arrayBuffer();
    await fs.promises.writeFile(tempPath, Buffer.from(arrayBuffer));
    return tempPath;
  }

  await fs.promises.writeFile(tempPath, Buffer.from(input, "base64"));
  return tempPath;
}

export async function POST(req: NextRequest) {
  let userFilePath: string | null = null;
  let garmentFilePath: string | null = null;

  try {
    const body = (await req.json()) as TryOnBody;
    const modelInput = body.modelImage || "";
    const garmentInput = body.garmentImage || "";
    const garmentTitle = body.productName || "Upper body top";

    if (!modelInput || !garmentInput) {
      return NextResponse.json(
        { error: "Please upload your portrait photo." },
        { status: 400 }
      );
    }

    const rawToken = APP_CONFIG?.HF_TOKEN || process.env.HF_TOKEN;
    const hfToken = rawToken ? (rawToken.trim() as `hf_${string}`) : undefined;

    userFilePath = await saveTempFile(modelInput, "user");
    garmentFilePath = await saveTempFile(garmentInput, "garment");

    console.log("[AI Try-On] Connecting to Hugging Face IDM-VTON cluster...");
    const client = await Client.connect("yisol/IDM-VTON", {
      token: hfToken && hfToken.startsWith("hf_") ? hfToken : undefined,
    });

    // Generate a fresh random seed on each call (mimics original Web UI)
    const randomSeed = Math.floor(Math.random() * 2147483647);

    const res: any = await client.predict("/tryon", [
      {
        background: handle_file(userFilePath),
        layers: [],
        composite: null,
      },
      handle_file(garmentFilePath),
      garmentTitle,
      true,        // is_checked (auto-mask)
      true,        // is_checked_crop (RESTORED: enables auto-alignment & original framing)
      30,          // denoise_steps
      randomSeed,  // seed (RESTORED: randomized per generation)
    ]);

    const data = res?.data;
    let outputUrl: string | null = null;

    if (Array.isArray(data) && data.length > 0) {
      const item = data[0];
      outputUrl =
        typeof item === "string" ? item : item?.url || item?.image?.url || null;
    }

    if (!outputUrl) {
      throw new Error("Model finished processing but returned no image URL.");
    }

    return NextResponse.json({
      url: outputUrl,
      resultImage: outputUrl,
    });
  } catch (err: any) {
    console.error("[AI Try-On Pipeline Error]:", err);
    return NextResponse.json(
      { error: err?.message || "Virtual Try-On generation failed." },
      { status: 500 }
    );
  } finally {
    if (userFilePath) fs.promises.unlink(userFilePath).catch(() => {});
    if (garmentFilePath) fs.promises.unlink(garmentFilePath).catch(() => {});
  }
}