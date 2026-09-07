import { motion } from "framer-motion";
import { ArrowRight, ChefHat, Sparkles, Utensils } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Utensils,
    title: "Add what you have",
    description:
      "Tell us what ingredients are waiting in your fridge, cupboard or freezer.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI creates your meal",
    description:
      "Our AI combines your ingredients into a recipe that actually makes sense.",
  },
  {
    number: "03",
    icon: ChefHat,
    title: "Start cooking",
    description:
      "Follow your personalised recipe and turn leftovers into something delicious.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-forest px-6 py-24 text-white md:px-12 lg:px-20 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            How it works
          </p>

          <h2 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            FROM LEFTOVERS
            <br />
            TO <span className="italic text-gold">SOMETHING</span>
            <br />
            DELICIOUS.
          </h2>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            No complicated meal planning. Just tell us what you already have
            and let AI turn it into your next favourite meal.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mt-16 grid gap-5 md:grid-cols-3 lg:mt-20">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.12,
                }}
                className="group relative min-h-[300px] rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 transition duration-300 hover:-translate-y-2 hover:bg-white/[0.09] sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-5xl text-white/15">
                    {step.number}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-forest transition duration-300 group-hover:rotate-6">
                    <Icon size={21} />
                  </div>
                </div>

                <div className="mt-16">
                  <h3 className="font-display text-2xl text-white sm:text-3xl">
                    {step.title}
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <ArrowRight
                    size={20}
                    className="absolute -right-3 top-1/2 z-10 hidden text-gold md:block"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Decorative circle */}
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full border border-gold/10" />
    </section>
  );
}

export default HowItWorks;