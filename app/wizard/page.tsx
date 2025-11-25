"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const rooms = [
  { id: "living-room", label: "Living room", description: "For cozy evenings and hosting." },
  { id: "kitchen", label: "Kitchen", description: "For cooking and entertaining." },
  { id: "bathroom", label: "Bathroom", description: "For a calm, spa-like retreat." },
];

const budgetRanges = [
  { id: "low", label: "Under  2.500", description: "Smaller updates: paint, textiles, a few pieces of furniture." },
  { id: "medium", label: " 2.500  7.500", description: "Balanced makeover: several furniture pieces and decor." },
  { id: "high", label: " 7.500  15.000", description: "Larger redesign with more furniture and light construction." },
  { id: "premium", label: "Over  15.000", description: "High-end makeover, custom work, and premium finishes." },
];

const styles = [
  {
    id: "scandinavian",
    label: "Scandinavian",
    description: "Bright, airy, and minimal with light wood and soft textiles.",
  },
  {
    id: "danish-minimalism",
    label: "Danish minimalism",
    description: "Light, calm, and functional with clean lines and natural wood.",
  },
  {
    id: "japandi",
    label: "Japandi",
    description: "A blend of Japanese and Scandinavian simplicity and warmth.",
  },
  {
    id: "modern",
    label: "Modern",
    description: "Sleek lines, neutral palette, and bold accent pieces.",
  },
  {
    id: "contemporary",
    label: "Contemporary",
    description: "Current trends with clean shapes and curated statement items.",
  },
  {
    id: "mid-century",
    label: "Mid-century modern",
    description: "Retro-inspired with organic forms and tapered wood legs.",
  },
  {
    id: "industrial",
    label: "Industrial",
    description: "Exposed materials, metal details, and an urban loft feel.",
  },
  {
    id: "english-cottage",
    label: "English cottage",
    description: "Cozy, layered, with character, florals, and painted wood.",
  },
  {
    id: "french-country",
    label: "French country",
    description: "Soft, rustic elegance with linen, stone, and muted colors.",
  },
  {
    id: "mediterranean",
    label: "Mediterranean",
    description: "Sun-washed colors, arches, and natural stone & timber.",
  },
  {
    id: "boho",
    label: "Boho chic",
    description: "Relaxed, layered textiles, plants, and collected objects.",
  },
  {
    id: "rural",
    label: "Rural / farmhouse",
    description: "Natural materials, shaker details, and a lived-in comfort.",
  },
  {
    id: "authentic",
    label: "Authentic / traditional",
    description: "Respects the existing architecture, moldings, and history.",
  },
];

const inspirationalImages: Record<string, string[]> = {
  "living-room": [
    "/stock/blueWalls_diningTable_whiteChairs_pendantLight_woodenFloor_geometricRug_vaseDecor.webp",
    "/stock/fireplace_armchair_bookshelves_rug_chandelier_curtains_painting_lamp_throwPillow_hardwoodFloor.webp",
    "/stock/graySofa_indoorPlants_woodenFloor_neutralColors_modernDesign_coffeeTable_floorLamp_accentChair_areaRug_lightCurtains.webp",
    "/stock/leatherChairs_leatherSofa_woodenBeams_bookshelves_coffeeTable_tableLamp_largeWindows_curtains_areaRug_indoorPlants.webp",
    "/stock/loft_industrial_leatherSofa_largeWindows_exposedBrick_coffeeTable_floorLamp_rug_pillow_modern.webp",  
    "/stock/minimalist_patio_whiteBench_cushions_archNiche_oliveTree_terracottaTiles_outdoorSeating.webp",
    "/stock/modern_livingRoom_beigeSofas_largeWindows_cityscapeView_coffeeTable_neutralTones_lamps_woodenCeiling_curtains.webp",
    "/stock/sofa_fireplace_naturalLight_lamp_rug_curtains_throwBlanket_wovenBasket_decorativeVases_neutralColors.webp",
    "/stock/whiteSofa_woodenCoffeeTable_floorLamps_shiplapWalls_wovenBaskets_neutralTones_greenPlant_cozySeating_naturalLight.webp",
  ],
  kitchen: [
    "/stock/minimalist_whiteCabinetry_largeIsland_abstractArt_concreteFloor_naturalLight_recessedLighting_indoorPlants_sleekDesign_glassBacksplash.webp",
    "/stock/woodenBeams_rustic_kitchenIsland_copperPans_blueCabinets_hangingLights_farmhouseSink_hardwoodFloor_vintageStyle_naturalLight.webp",
  ],
  bathroom: [
    "/stock/freestandingTub_largeWindows_gardenView_darkMarbleFloor_modernDesign_towelRack_neutralTones_luxurious.webp",
    "/stock/glassShower_subwayTiles_woodenVanity_minimalistDesign_rainShowerHead_whiteTiles_bathroomDecor_naturalLight_modernDesign.webp",
    "/stock/glassShower_roundMirror_vanity_patternedFloorTiles_whiteWalls_modernFaucet_toilet_window_showerhead_minimalistDesign.webp",
    "/stock/modern_bathroom_largeMirror_floatingVanity_wooden_ambientLighting_wallmountedFaucet_neutralTones_minimalist_window.webp",

    
  ],
  bedroom: [
    "/stock/bohemian_bed_macramWallHanging_plants_rattan_neutralTones_blanket_pottedPlants_wovenBaskets_hangingLight.webp",
    "/stock/minimalist_platformBed_neutralColors_hangingLights_woodenFurniture_vase_pillows_curtains_sideTables.webp",    
  ],
};

export default function WizardPage() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [squareMeters, setSquareMeters] = useState<string>("");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userNotes, setUserNotes] = useState<string>("");
  const [emailDraft, setEmailDraft] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [convertedImages, setConvertedImages] = useState<{ name: string; url: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleExit = () => {
    setSelectedRoom(null);
    setSelectedStyle(null);
    setSelectedBudget(null);
    setUserName("");
    setUserEmail("");
    setUserNotes("");
    setEmailDraft("");
    setSquareMeters("");
    setUploadedFiles([]);
    setConvertedImages([]);
    setImages([]);
    setError(null);
    setIsLoading(false);
    setStep(1);
    setCarouselIndex(0);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("renovation-wizard");
      window.location.href = "/";
    }
  };

  const handleBack = () => {
    if (step === 1) return;
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    }
  };

  // Restore previous choices for this browser session on first load
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.sessionStorage.getItem("renovation-wizard");
      if (!raw) return;
      const data = JSON.parse(raw) as {
        room?: string | null;
        style?: string | null;
        budget?: string | null;
        name?: string;
        email?: string;
        notes?: string;
        squareMeters?: string;
        step?: number;
      };
      if (data.room) setSelectedRoom(data.room);
      if (data.style) setSelectedStyle(data.style);
      if (data.budget) setSelectedBudget(data.budget);
      if (data.name) setUserName(data.name);
      if (data.email) setUserEmail(data.email);
      if (data.notes) setUserNotes(data.notes);
      if (data.squareMeters) setSquareMeters(data.squareMeters);
      // Always start from step 1 on a new visit; do not restore the saved step value.
    } catch {
      // ignore invalid stored data
    }
  }, []);

  // Persist choices within the current browser session
  useEffect(() => {
    if (typeof window === "undefined") return;
    const data = {
      room: selectedRoom,
      style: selectedStyle,
      budget: selectedBudget,
      name: userName,
      email: userEmail,
      notes: userNotes,
      squareMeters,
      step,
    };
    window.sessionStorage.setItem("renovation-wizard", JSON.stringify(data));
  }, [selectedRoom, selectedStyle, selectedBudget, userName, userEmail, userNotes, squareMeters, step]);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      setUploadedFiles([]);
      setConvertedImages([]);
      return;
    }

    const fileArray = Array.from(files).slice(0, 5);
    setUploadedFiles(fileArray);

    const converted: { name: string; url: string }[] = [];

    for (const file of fileArray) {
      try {
        const imageBitmap = await createImageBitmap(file);
        const canvas = document.createElement("canvas");
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        ctx.drawImage(imageBitmap, 0, 0);

        const blob: Blob | null = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/webp")
        );
        if (!blob) continue;

        const url = URL.createObjectURL(blob);
        const baseName = file.name.replace(/\.[^.]+$/, "");
        converted.push({ name: `${baseName}.webp`, url });
      } catch {
        // ignore conversion errors per file
      }
    }

    setConvertedImages(converted);
  };

  const activeStockImages = useMemo(() => {
    if (!selectedRoom) return inspirationalImages["living-room"];
    if (selectedRoom === "kitchen") return inspirationalImages.kitchen;
    if (selectedRoom === "bathroom") return inspirationalImages.bathroom;
    return inspirationalImages["living-room"];
  }, [selectedRoom]);

  useEffect(() => {
    if (!isLoading || step !== 3) return;
    if (!activeStockImages || activeStockImages.length === 0) return;

    const id = window.setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % activeStockImages.length);
    }, 2000);

    return () => {
      window.clearInterval(id);
    };
  }, [isLoading, step, activeStockImages]);

  // Call backend to generate images when we arrive at step 3 with valid choices
  useEffect(() => {
    if (step !== 3) return;
    if (!selectedRoom || !selectedStyle) return;

    let cancelled = false;

    const run = async () => {
      setIsLoading(true);
      setError(null);
      setImages([]);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ room: selectedRoom, style: selectedStyle }),
        });

        if (!res.ok) {
          const text = await res.text();
          if (!cancelled) {
            console.error("/api/generate failed", text);
            setError("Something went wrong while generating your images. Please try again.");
          }
          return;
        }

        const data = (await res.json()) as { images?: string[] };
        if (!cancelled) {
          setImages(Array.isArray(data.images) ? data.images : []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error calling /api/generate", err);
          setError("Unable to reach the image service. Please check your connection and try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [step, selectedRoom, selectedStyle]);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <main className="mx-auto flex min-h-screen max-w-xl flex-col px-4 py-6">
        <header className="mb-4 flex items-center justify-between gap-3">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Step {step} of 4
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={step === 1}
              onClick={handleBack}
              className="inline-flex min-w-24 items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-xs font-medium text-zinc-700 shadow-sm transition enabled:hover:border-zinc-400 enabled:hover:bg-white disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-300"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleExit}
              className="inline-flex min-w-24 items-center justify-center rounded-full border border-transparent bg-zinc-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-black"
            >
              Exit
            </button>
          </div>
        </header>

        {step === 1 && (
          <section className="flex flex-1 flex-col gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Which room do you want to renovate?</h1>
              <p className="text-sm text-zinc-600">
                Choose the part of your home you would like to see in a new style.
              </p>
            </div>

            <div className="mt-2 grid gap-3">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => {
                    setSelectedRoom(room.id);
                    setStep(2);
                  }}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-black/60 ${
                    selectedRoom === room.id
                      ? "border-black bg-black text-white"
                      : "border-zinc-200 bg-white hover:border-black/60"
                  }`}
                >
                  <div className="text-sm font-semibold">{room.label}</div>
                  <div
                    className={`mt-1 text-xs ${
                      selectedRoom === room.id ? "text-zinc-100" : "text-zinc-500"
                    }`}
                  >
                    {room.description}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="flex flex-1 flex-col gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Here is what could inspire you.</h1>
              <p className="text-sm text-zinc-600">
                A visual idea of your {selectedRoom?.replace("-", " ") ?? "room"} in
                {" "}
                <span className="font-medium">
                  {styles.find((s) => s.id === selectedStyle)?.label ?? "your chosen style"}
                </span>
                .
              </p>
            </div>

            {isLoading && (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-500">
                Creating a few inspirational views for your space	this may take a few seconds...
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {!isLoading && !error && images.length > 0 && (
              <>
                <div className="mt-1 rounded-2xl border border-zinc-200 bg-white p-3 text-xs text-zinc-700">
                  <p className="mb-2">
                    Review these suggestions. If they look reasonable as a starting point, continue to the
                    final step to share your details so we can follow up.
                  </p>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-black"
                    >
                      Continue to details
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {images.map((src) => (
                    <div
                      key={src}
                      className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100"
                    >
                      <img
                        src={src}
                        alt="AI generated interior suggestion"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {!isLoading && !error && images.length === 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-xs text-zinc-600">
                No images yet. Try going back, adjusting your choices, and continuing again.
              </div>
            )}
          </section>
        )}

        {step === 2 && (
          <section className="flex flex-1 flex-col gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Great, lets pick a style next.</h1>
              <p className="text-sm text-zinc-600">
                Selected room: <span className="font-medium">{selectedRoom?.replace("-", " ")}</span>.
                Choose a style you want to see this space in.
              </p>
            </div>

            <div className="mt-2 flex gap-3">
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-black/60 ${
                      selectedStyle === style.id
                        ? "border-black bg-black text-white"
                        : "border-zinc-200 bg-white hover:border-black/60"
                    }`}
                  >
                    <div className="text-sm font-semibold">{style.label}</div>
                    <div
                      className={`mt-1 text-xs ${
                        selectedStyle === style.id ? "text-zinc-100" : "text-zinc-500"
                      }`}
                    >
                      {style.description}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex w-28 flex-col">
                <button
                  type="button"
                  disabled={!selectedStyle}
                  onClick={() => {
                    if (!selectedStyle) return;
                    setStep(3);
                  }}
                  className="flex h-full min-h-[6rem] flex-1 items-center justify-center rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white shadow-sm transition enabled:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                >
                  See
                  <br />
                  results
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="flex flex-1 flex-col gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Share your details to get a follow-up.</h1>
              <p className="text-sm text-zinc-600">
                We will prepare a draft email summarizing your room, style, and budget for
                info@costadelsolservices.es. You can review and adjust it before anything is sent.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-600">Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black/60"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600">Email</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black/60"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600">
                  Approximate area to renovate (m²)
                </label>
                <input
                  type="number"
                  min={0}
                  max={1000}
                  value={squareMeters}
                  onChange={(e) => setSquareMeters(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black/60"
                  placeholder="e.g. 20"
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  A rough estimate is enough; you can refine it together later.
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600">Extra notes (optional)</label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black/60"
                  placeholder="Anything else we should know about your project?"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600">
                  Room photos (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFilesSelected(e.target.files)}
                  className="mt-1 block w-full text-xs text-zinc-600 file:mr-3 file:rounded-full file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white file:hover:bg-black"
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  You can select up to 5 photos from different angles. They will be converted to
                  .webp for smaller email attachments.
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
              <div className="font-medium text-zinc-700">Quick summary</div>
              <ul className="space-y-1">
                <li>
                  <span className="font-medium">Room:</span>{" "}
                  {selectedRoom?.replace("-", " ") ?? "not selected"}
                </li>
                <li>
                  <span className="font-medium">Style:</span>{" "}
                  {styles.find((s) => s.id === selectedStyle)?.label ?? "not selected"}
                </li>
                <li>
                  <span className="font-medium">Budget:</span>{" "}
                  {selectedBudget
                    ? budgetRanges.find((b) => b.id === selectedBudget)?.label
                    : "not selected"}
                </li>
                <li>
                  <span className="font-medium">Approx. area:</span>{" "}
                  {squareMeters ? `${squareMeters} m²` : "not provided"}
                </li>
                <li>
                  <span className="font-medium">Photos selected:</span>{" "}
                  {uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s)` : "none"}
                </li>
              </ul>
            </div>

            {convertedImages.length > 0 && (
              <div className="space-y-2 rounded-2xl border border-zinc-200 bg-white p-3 text-xs text-zinc-600">
                <div className="font-medium text-zinc-700">Converted .webp downloads</div>
                <p className="text-[11px] text-zinc-500">
                  Download these optimized .webp versions and attach them to your email.
                </p>
                <ul className="space-y-1">
                  {convertedImages.map((img) => (
                    <li key={img.url}>
                      <a
                        href={img.url}
                        download={img.name}
                        className="text-xs font-medium text-zinc-700 underline-offset-2 hover:text-zinc-900 hover:underline"
                      >
                        {img.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="button"
                disabled={!userName || !userEmail}
                onClick={() => {
                  if (!userName || !userEmail) return;
                  const roomLabel = selectedRoom?.replace("-", " ") ?? "(no room selected)";
                  const styleLabel = styles.find((s) => s.id === selectedStyle)?.label ?? "(no style selected)";
                  const budgetLabel = selectedBudget
                    ? budgetRanges.find((b) => b.id === selectedBudget)?.label
                    : "(no budget selected)";
                  const areaLabel = squareMeters ? `${squareMeters} m²` : "(not provided)";
                  const photoLabel =
                    uploadedFiles.length > 0
                      ? `${uploadedFiles.length} photo(s) selected (WebP downloads available in the wizard).`
                      : "(no photos attached yet)";

                  const draft = `To: info@costadelsolservices.com, nicolas.cloet@gmail.com
From: ${userName} <${userEmail}>

Subject: Renovation inquiry for ${roomLabel} in ${styleLabel}

Hello Costa del Sol Services,

I would like to explore renovation options for my ${roomLabel} in a ${styleLabel} style.

Estimated budget: ${budgetLabel}.

Approximate area to renovate: ${areaLabel}.

Room photos: ${photoLabel}

Additional notes:
${userNotes || "(none)"}

Please let me know how we could proceed and what the next steps would be.

Best regards,
${userName}`;

                  setEmailDraft(draft);
                }}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white shadow-sm transition enabled:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                Generate email draft
              </button>

              {emailDraft && (
                <div className="space-y-2 rounded-2xl border border-zinc-200 bg-white p-3">
                  <div className="text-xs font-medium text-zinc-700">
                    Step 1 of 2: Check if your information and this email look correct.
                  </div>
                  <textarea
                    value={emailDraft}
                    onChange={(e) => setEmailDraft(e.target.value)}
                    rows={10}
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs font-mono outline-none focus:border-black focus:ring-1 focus:ring-black/60"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Copy this text into your email app and send it to{" "}
                    <span className="font-medium">info@costadelsolservices.com</span> (you can keep
                    nicolas.cloet@gmail.com in copy if you like).
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        <footer className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-200 pt-3">
          <div className="text-xs text-zinc-500">
            {step === 1 && "You can change this later in the flow."}
            {step === 2 && "Room choice is saved for the next steps."}
            {step === 3 && ""}
            {step === 4 && "Review your details and generate an email draft when you're ready."}
          </div>
        </footer>
      </main>
    </div>
  );
}
