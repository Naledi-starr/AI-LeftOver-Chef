/**
 * Impact / Food-waste section.
 * Gives the product emotional weight and portfolio storytelling value.
 */

import { motion } from "framer-motion";
import { Leaf, Recycle, Sparkles } from "lucide-react";

const stats = [
  {
    icon: Recycle,
    value: "1/3",
    label: "of all food produced is wasted globally",
  },
  {
    icon: Leaf,
    value: "8%",
    label: "of greenhouse gases come from food waste",
  },
  {
    icon: Sparkles,
    value: "AI",
    label: "can help turn leftovers into real meals",
  },
];

function ImpactSection() {
  return (
    <section className="relative overflow-hidden bg-forest px-6 py-24 text-white md:px-12 lg:px-20 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Why it matters
            </p>

            <h2 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
              LESS WASTE.
              <br />
              MORE
              <br />
              <span className="italic text-gold">FLAVOUR.</span>
            </h2>

            <p className="mt-7 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
              Every time you cook with what you already have, you reduce waste,
              save money, and discover meals you might never have tried. AI
              Leftover Chef makes that easier.
            </p>
          </motion.div>

          {/* Right stats */}
          <div className="grid gap-5">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.06] p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-forest">
                    <Icon size={22} />
                  </div>

                  <div>
                    <p className="font-display text-3xl text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Soft decorative circle */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full border border-gold/10" />
    </section>
  );
}

export default ImpactSection;