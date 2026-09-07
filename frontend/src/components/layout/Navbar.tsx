import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onStart: () => void;
}

function Navbar({ onStart }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-20 flex items-center justify-between py-4">
      <a
        className="flex items-center gap-3 text-lg font-bold text-forest"
        href="#top"
        aria-label="AI Leftover Chef home"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-sm font-black text-forest">
          AL
        </span>
        <span>leftover chef</span>
      </a>

      <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
        <a className="text-sm font-medium text-gray-600 transition hover:text-forest" href="#how-it-works">
          How it works
        </a>
        <button
          type="button"
          onClick={onStart}
          className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          Start cooking →
        </button>
      </nav>

      <button
        type="button"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        className="rounded-xl p-2 text-forest md:hidden"
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute left-0 right-0 top-full mt-3 rounded-2xl border border-forest/10 bg-white p-4 shadow-xl md:hidden"
            aria-label="Mobile navigation"
          >
            <a
              className="block rounded-xl px-4 py-3 font-medium text-forest"
              href="#how-it-works"
              onClick={() => setIsMenuOpen(false)}
            >
              How it works
            </a>
            <button
              type="button"
              onClick={() => {
                onStart();
                setIsMenuOpen(false);
              }}
              className="mt-2 w-full rounded-xl bg-forest px-5 py-4 font-semibold text-white"
            >
              ✨ Start cooking
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;