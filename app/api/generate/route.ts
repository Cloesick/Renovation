import { NextRequest, NextResponse } from "next/server";

const STYLE_PROMPTS: Record<string, string> = {
  scandinavian:
    "A bright, airy Scandinavian [ROOM] interior. White and light neutral walls, pale oak floor, simple functional furniture, soft textiles, plants, minimal clutter.",
  "danish-minimalism":
    "A Danish minimalist [ROOM] interior. Calm, uncluttered space with warm white walls, natural oak furniture, simple built-in storage, very few carefully chosen objects, soft indirect lighting, focus on functionality and comfort.",
  japandi:
    "A Japandi style [ROOM] interior. Low-profile furniture, mix of light wood and black accents, neutral earthy palette, linen textiles, organic shapes, lots of empty space and balance.",
  modern:
    "A modern [ROOM] interior. Clean straight lines, large neutral sofa, low modern coffee table, minimal decor, large abstract art on the wall, hidden storage, integrated lighting, smooth finishes, glass and metal details.",
  contemporary:
    "A contemporary [ROOM] interior with current design trends, simple forms, neutral base with a few bold accent colors, curated statement pieces, big rug defining the seating area, floor-to-ceiling curtains, modern lighting fixtures.",
  "mid-century":
    "A mid-century modern [ROOM] interior. Walnut wood furniture with tapered legs, iconic armchairs, low sideboard, geometric rug, warm earthy colors, simple graphic art, lots of natural light.",
  industrial:
    "An industrial [ROOM] interior. Exposed brick or concrete, large factory-style windows, metal and reclaimed wood furniture, leather sofa, visible pipes or ducts, neutral grey and brown palette.",
  "english-cottage":
    "An English cottage [ROOM]. Cozy and layered: painted wood panelling, floral patterns, mix of vintage furniture, open shelves with books and ceramics, soft warm lighting, fireplace, woven baskets, soft rug.",
  "french-country":
    "A French country [ROOM]. Soft rustic elegance, light neutral walls, exposed beams or stone, linen sofas, distressed wood furniture, curved lines, muted blues and greys, classic fireplace, fresh flowers.",
  mediterranean:
    "A Mediterranean [ROOM] interior. White or sand-colored plaster walls, arched openings, terracotta or stone flooring, wood beams, built-in bench seating with cushions, natural fabrics, warm sunlight.",
  boho:
    "A boho chic [ROOM]. Relaxed layered textiles, patterned rugs and pillows, plants, rattan and wood furniture, collected objects, wall hangings, warm lighting, slightly eclectic but harmonious colors.",
  rural:
    "A modern farmhouse [ROOM]. Simple painted walls, large comfortable sofa, wooden coffee table, neutral textiles, black metal accents, rustic decor, big windows, natural light.",
  authentic:
    "A traditional [ROOM] that respects existing architecture. Detailed moldings or panelling, classic furniture silhouettes, rich but balanced patterns, warm color palette, framed art, layered lighting.",
};

function buildPrompt(room: string, style: string): string {
  const roomName =
    room === "kitchen" ? "kitchen" : room === "bathroom" ? "bathroom" : "living room";

  const base = STYLE_PROMPTS[style] ??
    "A realistic [ROOM] interior, thoughtfully designed, photorealistic, wide-angle.";

  const withRoom = base.replace("[ROOM]", roomName);

  return (
    withRoom +
    " Photorealistic interior photograph, wide angle, high resolution, natural light."
  );
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const room = (body.room as string | undefined) ?? "living-room";
    const style = (body.style as string | undefined) ?? "modern";

    const prompt = buildPrompt(room, style);

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        n: 3,
        size: "1024x1024",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI image generation failed", errorText);
      return NextResponse.json(
        { error: "Image generation failed" },
        { status: 500 }
      );
    }

const raw = await response.json();
console.log("OpenAI image raw response", raw);

const data = raw as {
  data?: { url?: string; b64_json?: string }[];
};

const images = (data.data ?? [])
  .map((item) => {
    if (typeof item.url === "string") {
      return item.url;
    }
    if (typeof item.b64_json === "string") {
      return `data:image/png;base64,${item.b64_json}`;
    }
    return undefined;
  })
  .filter((u): u is string => typeof u === "string");

if (images.length === 0) {
  console.error("OpenAI returned no images", raw);
  return NextResponse.json(
    { error: "Image generation returned no images" },
    { status: 500 }
  );
}

return NextResponse.json({ images });
  } catch (error) {
    console.error("Error in /api/generate", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
