"use client";

import { useState } from "react";

const EVENT_TYPES = [
  "Wedding",
  "Pre-Wedding",
  "New Born",
  "Toddlers",
  "Modeling",
  "Other",
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lines = [
      `Hi Phorish Shoots! I'm ${name || "___"}.`,
      `Event: ${eventType}${date ? ` on ${date}` : ""}`,
      message ? `Details: ${message}` : "",
    ].filter(Boolean);
    window.open(
      `https://wa.me/918500362643?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener",
    );
  }

  const input =
    "h-12 w-full border border-foreground/20 bg-cream px-4 text-sm text-foreground placeholder:text-muted/70 focus:border-terracotta focus:outline-none";

  return (
    <form onSubmit={onSubmit} aria-label="Book Phorish Shoots on WhatsApp" className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label htmlFor="contact-name" className="flex flex-col gap-2 text-[12px] font-medium tracking-[0.18em] uppercase text-muted">
          Your name
          <input
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Priya & Arjun"
            className={input}
          />
        </label>
        <label htmlFor="contact-event" className="flex flex-col gap-2 text-[12px] font-medium tracking-[0.18em] uppercase text-muted">
          Event type
          <select
            id="contact-event"
            name="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className={input}
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label htmlFor="contact-date" className="flex flex-col gap-2 text-[12px] font-medium tracking-[0.18em] uppercase text-muted">
        Event date
        <input
          id="contact-date"
          name="date"
          type="date"
          autoComplete="off"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={input}
        />
      </label>
      <label htmlFor="contact-message" className="flex flex-col gap-2 text-[12px] font-medium tracking-[0.18em] uppercase text-muted">
        Anything we should know?
        <textarea
          id="contact-message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Venue, city, how many days…"
          rows={4}
          className="w-full border border-foreground/20 bg-cream px-4 py-3 text-sm text-foreground placeholder:text-muted/70 focus:border-terracotta focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className="mt-2 inline-flex h-12 items-center justify-center bg-foreground px-7 text-[11px] tracking-[0.22em] uppercase text-background transition-colors hover:bg-terracotta"
      >
        Send on WhatsApp
      </button>
      <p className="text-[13px] leading-6 text-muted">
        Opens WhatsApp with your message ready — no account needed, just press
        send. We usually reply the same day.
      </p>
    </form>
  );
}
