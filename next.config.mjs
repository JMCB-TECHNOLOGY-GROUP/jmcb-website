/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Clickjacking — disallow framing entirely
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Force HTTPS for 2 years across subdomains, eligible for HSTS preload list
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Limit referrer leakage to cross-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable powerful features by default
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Note: CSP intentionally omitted for now — needs targeted audit of
  // inline scripts (JSON-LD in layout, print-button in /report/[id])
  // and Clerk/Sentry/Vercel-Analytics origins. Add in a follow-up PR
  // with Report-Only mode first to surface violations safely.
];

const nextConfig = {
  // The paid edition of The Laboratory Method is read from disk by
  // /api/book/download after Stripe verification. It lives under src/content
  // (never public/), so the serverless function needs it traced in explicitly.
  experimental: {
    outputFileTracingIncludes: {
      "/api/book/download": ["./src/content/book/**/*"],
    },
    // CV parsing (/api/career-assessment/resume) must not be bundled.
    // pdf-parse loads pdfjs's worker by a path relative to its own package;
    // once webpack relocates the code that path breaks at runtime with
    // "Setting up fake worker failed". Keeping these external makes Node
    // require them from node_modules, where their internal paths still hold.
    serverComponentsExternalPackages: ["pdf-parse", "word-extractor", "mammoth", "@napi-rs/canvas"],
    // pdf-parse's pdfjs build loads @napi-rs/canvas dynamically for DOMMatrix,
    // ImageData and Path2D. The function bundler only ships what it can
    // trace, so the package was missing in production and every PDF upload
    // failed with "DOMMatrix is not defined" (found 2026-09-06 on a real
    // upload). Force the package and its Linux binary into the function.
    outputFileTracingIncludes: {
      "/api/career-assessment/resume": [
        "./node_modules/@napi-rs/canvas/**/*",
        "./node_modules/@napi-rs/canvas-linux-x64-gnu/**/*",
        // pdfjs resolves its worker by path at runtime ("Setting up fake
        // worker failed: Cannot find module .../pdf.worker.mjs"), so the
        // whole build directory has to travel with the function too.
        "./node_modules/pdfjs-dist/**/*",
        "./node_modules/pdf-parse/**/*",
      ],
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
