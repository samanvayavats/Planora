import { Mail } from "lucide-react";

// Lightweight inline brand SVGs (Zero package dependencies)
function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XTwitterIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative m-2 overflow-hidden rounded-2xl border-2 border-slate-900 bg-slate-950 px-6 py-5 text-slate-400 shadow-lg shadow-slate-900 md:px-12">
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute -top-12 left-1/3 h-32 w-64 rounded-full bg-cyan-500/10 blur-2xl" />

      {/* Top Row: Brand, Glowing Tagline & Socials */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* Brand & Glowing Inline Tag */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-center md:justify-start md:text-left">
          <span className="font-playfair text-2xl font-bold text-white">Planora</span>

          <span className="hidden text-slate-700 sm:inline">•</span>

          {/* Glowing Tagline */}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 bg-clip-text text-xs sm:text-sm font-medium tracking-wide text-transparent drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]">
            AI-Powered House Planning &amp; Blueprint Generator
          </span>
        </div>

        {/* Social Buttons */}
        <div className="flex items-center space-x-2.5">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 transition hover:border-cyan-500/40 hover:bg-slate-800 hover:text-cyan-400"
            aria-label="X (Twitter)"
          >
            <XTwitterIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 transition hover:border-cyan-500/40 hover:bg-slate-800 hover:text-cyan-400"
            aria-label="GitHub"
          >
            <GithubIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 transition hover:border-cyan-500/40 hover:bg-slate-800 hover:text-cyan-400"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href="mailto:support@planora.ai"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 transition hover:border-cyan-500/40 hover:bg-slate-800 hover:text-cyan-400"
            aria-label="Email support"
          >
            <Mail className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Bottom Row: Copyright & Status */}
      <div className="mt-4 flex flex-col items-center justify-between border-t border-slate-900/80 pt-3 text-[11px] text-slate-500 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Planora Inc. All rights reserved.</p>

        <div className="mt-2 flex items-center space-x-2 sm:mt-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-slate-400">AI Blueprint Engine Operational</span>
        </div>
      </div>
    </footer>
  );
}
