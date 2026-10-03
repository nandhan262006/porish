"use client";

import React from "react";
import { motion, MotionConfig } from "motion/react";

type Testimonial = {
  text: string;
  name: string;
  role: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    text: "They didn't just take photos — they gave us our day back. Every ritual, every tear, held exactly as it happened.",
    name: "Sruthi & Kiran",
    role: "Wedding · Nizamabad",
  },
  {
    text: "We are camera-shy people, but Harish made us forget the lens existed. Our pre-wedding feels like us, not a shoot.",
    name: "Madhuri & Sandeep",
    role: "Pre-Wedding · Hyderabad",
  },
  {
    text: "Our daughter slept through half the session and they still came home with magic. Gentle, patient, invisible.",
    name: "Lakshmi & Arvind",
    role: "New Born · Nizamabad",
  },
  {
    text: "The teaser had my mother in tears within a day. The full film felt like reliving the wedding with better light.",
    name: "Divya & Rohit",
    role: "Wedding · Karimnagar",
  },
  {
    text: "Chasing a two-year-old with a camera is chaos. They turned it into the happiest album on our shelf.",
    name: "Priya & Naveen",
    role: "Toddler · Hyderabad",
  },
  {
    text: "Editorial eye, documentary heart. My portfolio finally looks like the work I want to be hired for.",
    name: "Ananya Rao",
    role: "Modeling · Hyderabad",
  },
  {
    text: "Guests are still talking about how unobtrusive they were — and then the photos arrived and nobody missed a thing.",
    name: "Kavya & Aditya",
    role: "Wedding · Warangal",
  },
  {
    text: "Golden hour, an empty fort, and two people who knew exactly when to step back. Worth every rupee.",
    name: "Sneha & Varun",
    role: "Pre-Wedding · Bidar",
  },
  {
    text: "Professional from the first call to the final gallery delivery. Private links, quick edits, zero stress.",
    name: "Meera & Karthik",
    role: "Wedding · Nizamabad",
  },
];

function initials(name: string) {
  return name
    .replace(/&/g, " ")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function TestimonialCard({ text, name, role }: Testimonial) {
  return (
    <figure className="w-full max-w-xs rounded-2xl border border-black/10 bg-cream p-8 shadow-[0_18px_40px_rgba(26,20,16,0.08)]">
      <div aria-label="5 out of 5 stars" className="text-sm tracking-[0.2em] text-terracotta">
        ★★★★★
      </div>
      <blockquote className="mt-4 text-[0.9375rem] leading-7 text-foreground/85">
        &ldquo;{text}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-medium tracking-[0.08em] text-background"
        >
          {initials(name)}
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-medium tracking-tight text-foreground">
            {name}
          </span>
          <span className="text-xs tracking-tight text-muted">{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function TestimonialsColumn({
  className = "",
  testimonials,
  duration = 24,
  reverse = false,
}: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
  reverse?: boolean;
}) {
  return (
    <div className={className}>
      <motion.div
        animate={reverse ? { translateY: ["-50%", "0%"] } : { translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[0, 1].map((copy) => (
          <React.Fragment key={copy}>
            {testimonials.map((t) => (
              <TestimonialCard key={`${copy}-${t.name}`} {...t} />
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export default function Testimonials() {
  const firstColumn = TESTIMONIALS.slice(0, 3);
  const secondColumn = TESTIMONIALS.slice(3, 6);
  const thirdColumn = TESTIMONIALS.slice(6, 9);

  return (
    <section className="relative my-20 overflow-hidden">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[540px] flex-col items-center justify-center text-center"
        >
          <p className="eyebrow">Love notes</p>
          <h2 className="serif-display mt-4 text-5xl md:text-6xl">
            Words from our couples
          </h2>
          <p className="mt-5 text-[0.9375rem] leading-7 text-muted">
            Real families, real celebrations — and the frames they took home.
          </p>
        </motion.div>

        <MotionConfig reducedMotion="user">
          <div className="mt-12 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
            <TestimonialsColumn testimonials={firstColumn} duration={26} />
            <TestimonialsColumn
              testimonials={secondColumn}
              className="hidden md:block"
              duration={32}
              reverse
            />
            <TestimonialsColumn
              testimonials={thirdColumn}
              className="hidden lg:block"
              duration={29}
            />
          </div>
        </MotionConfig>
      </div>
    </section>
  );
}
