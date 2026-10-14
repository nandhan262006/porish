"use client";

import React from "react";
import { motion, MotionConfig } from "motion/react";

type Testimonial = {
  text: string;
  name: string;
  role: string;
};

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
      <div role="img" aria-label="Rated 5 out of 5 stars" className="text-sm tracking-[0.2em] text-terracotta">
        <span aria-hidden>★★★★★</span>
      </div>
      <blockquote className="mt-4 text-[1rem] leading-8 text-foreground/90">
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
          <span className="text-[0.9375rem] font-medium tracking-tight text-foreground">
            {name}
          </span>
          <span className="text-[13px] tracking-tight text-muted">{role}</span>
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
    <div className={className} aria-hidden={undefined}>
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
              <div key={`${copy}-${t.name}`} aria-hidden={copy === 1 || undefined}>
                <TestimonialCard {...t} />
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export default function Testimonials({ items }: { items: Testimonial[] }) {
  const firstColumn = items.slice(0, 3);
  const secondColumn = items.slice(3, 6);
  const thirdColumn = items.slice(6, 9);

  return (
    <section aria-labelledby="testimonials-heading" className="relative my-20 overflow-hidden">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[540px] flex-col items-center justify-center text-center"
        >
          <p className="eyebrow">Client love notes · 4.9 ★ from 85 Google reviews</p>
          <h2 id="testimonials-heading" className="serif-display mt-4 text-5xl md:text-6xl">
            Words from our couples
          </h2>
          <p className="mt-5 text-[1rem] leading-8 text-muted">
            Real weddings, newborn sessions and family celebrations across
            Nizamabad, Hyderabad and Telangana — and the frames they took home.
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
