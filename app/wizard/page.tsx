"use client";

import { useState } from "react";
import Link from "next/link";

const rooms = [
  { id: "living-room", label: "Living room", description: "For cozy evenings and hosting." },
  { id: "kitchen", label: "Kitchen", description: "For cooking and entertaining." },
  { id: "bathroom", label: "Bathroom", description: "For a calm, spa-like retreat." },
];

export default function WizardPage() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <main className="mx-auto flex min-h-screen max-w-xl flex-col px-4 py-6">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-800">
            1 Back
          </Link>
          <div className="text-xs uppercase tracking-wide text-zinc-500">Step 1 of 5</div>
        </header>

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
                onClick={() => setSelectedRoom(room.id)}
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

        <footer className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-4">
          <div className="text-xs text-zinc-500">
            You can change this later in the flow.
          </div>
          <button
            type="button"
            disabled={!selectedRoom}
            className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white shadow-sm transition enabled:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            Next
          </button>
        </footer>
      </main>
    </div>
  );
}
