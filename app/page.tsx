"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const homeInspirationalImages = [
  "/stock/modern_livingRoom_beigeSofas_largeWindows_cityscapeView_coffeeTable_neutralTones_lamps_woodenCeiling_curtains.webp",
  "/stock/whiteSofa_woodenCoffeeTable_floorLamps_shiplapWalls_wovenBaskets_neutralTones_greenPlant_cozySeating_naturalLight.webp",
  "/stock/woodenBeams_rustic_kitchenIsland_copperPans_blueCabinets_hangingLights_farmhouseSink_hardwoodFloor_vintageStyle_naturalLight.webp",
  "/stock/freestandingTub_largeWindows_gardenView_darkMarbleFloor_modernDesign_towelRack_neutralTones_luxurious.webp",
  "/stock/bohemian_bed_macramWallHanging_plants_rattan_neutralTones_blanket_pottedPlants_wovenBaskets_hangingLight.webp",
];

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (homeInspirationalImages.length <= 1) return;
    const id = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % homeInspirationalImages.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-between px-6 py-10">
        <header className="mb-10 flex items-center justify-between">
          <div className="text-sm font-semibold tracking-wide text-zinc-700">
            Renovation Studio
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center gap-6">
          <div className="space-y-3 text-center sm:text-left">
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              See your home in a new style in seconds.
            </h1>
          </div>

          <div className="mt-4 flex flex-col items-center gap-3 sm:items-start">
            <Link
              href="/wizard"
              className="inline-flex w-full items-center justify-center rounded-full bg-black px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-zinc-800 sm:w-auto"
            >
              Start free makeover
            </Link>
          </div>

          <section className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-black/5">
            <div className="relative h-64 w-full">
              {homeInspirationalImages.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt="Inspirational interior"
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                    idx === heroIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>
          </section>

          <div className="mt-8 grid grid-cols-3 gap-3 text-xs text-zinc-500 sm:text-sm">
            <div>
              <div className="font-medium text-zinc-700">1. Choose room</div>
              <div>Living room, kitchen, or bathroom.</div>
            </div>
            <div>
              <div className="font-medium text-zinc-700">2. Pick style</div>
              <div>Danish minimalism, English cottage, modern & more.</div>
            </div>
            <div>
              <div className="font-medium text-zinc-700">3. Get ideas</div>
              <div>AI visuals and suggestions for your budget.</div>
            </div>
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-zinc-400">
          &copy; 2025
          {" "}
          <a
            href="https://costadelsolservices.es"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-zinc-600"
          >
            Costa del Sol Services
          </a>
          {" "}
          - CDSS - designed by
          {" "}
          <a
            href="https://saspire.org"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-zinc-600"
          >
            Saspire.org
          </a>
        </footer>
      </main>
    </div>
  );
}
