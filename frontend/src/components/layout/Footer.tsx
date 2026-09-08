/**
 * Site footer for AI Leftover Chef.
 */

import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t border-forest/10 bg-cream px-6 py-14 md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        {/* Brand */}
        <div className="text-center md:text-left">
          <p className="font-display text-2xl tracking-tight text-forest">
            LeftoverChef
          </p>
          <p className="mt-2 max-w-xs text-sm text-gray-500">
            Turn what you already have into something delicious.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
          <a
            href="#how-it-works"
            className="transition hover:text-forest"
          >
            How it works
          </a>
          <a
            href="#generator"
            className="transition hover:text-forest"
          >
            Generate recipe
          </a>
          <a
            href="#"
            className="transition hover:text-forest"
          >
            About
          </a>
        </div>

        {/* Social / credit */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-forest/15 p-2.5 text-forest transition hover:bg-forest hover:text-white"
            aria-label="GitHub"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-forest/15 p-2.5 text-forest transition hover:bg-forest hover:text-white"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={18} />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-forest/10 pt-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} LeftoverChef · Built with AI · Reduce food waste and save money
      </div>
    </footer>
  );
  
}
export default Footer;